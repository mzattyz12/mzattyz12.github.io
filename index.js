const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.sendPush = functions.https.onRequest(async (req, res) => {
  try {
    const { indicativo, mensaje, password } = req.body;

    if (password !== "981423") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const db = admin.firestore();
    const snap = await db.collection("lvp").where("indicativo", "==", indicativo).get();

    if (snap.empty) {
      return res.status(404).json({ error: "Indicativo no encontrado" });
    }

    const tokens = snap.docs.map(d => d.data().token);

    await admin.messaging().sendMulticast({
      tokens,
      notification: {
        title: "Notificación importante",
        body: mensaje
      }
    });

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal error" });
  }
});
