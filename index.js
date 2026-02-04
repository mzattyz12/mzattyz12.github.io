
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const sendPush = functions.https.onRequest(async (req, res) => {
  try {
    const { indicativo, mensaje, password } = req.body;

    if (password !== "981423") {
      return res.json({ ok: false, error: "Contraseña incorrecta" });
    }

    const snap = await db.collection("lvp").where("indicativo", "==", indicativo).get();
    if (snap.empty) return res.json({ ok: false, error: "Dispositivo no encontrado" });

    const tokens = snap.docs.map(d => d.data().token);

    const payload = {
      notification: {
        title: "Notificación importante",
        body: mensaje
      }
    };

    await admin.messaging().sendToDevice(tokens, payload);
    res.json({ ok: true });
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});
