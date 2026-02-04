
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
package com.your.package.name // Replace with your package name

import android.app.Application;
import kotlinx.coroutines.CoroutineScope;
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

import com.onesignal.OneSignal
import com.onesignal.debug.LogLevel

class ApplicationClass : Application() {
    override fun onCreate() {
        super.onCreate()

        // Enable verbose logging for debugging (remove in production)
        OneSignal.Debug.logLevel = LogLevel.VERBOSE
        // Initialize with your OneSignal App ID
        OneSignal.initWithContext(this, "332721bb-21df-4486-8552-3f36a1899772")
        // Use this method to prompt for push notifications.
        // We recommend removing this method after testing and instead use In-App Messages to prompt for notification permission.
        CoroutineScope(Dispatchers.IO).launch {
            OneSignal.Notifications.requestPermission(true)
        }
    }
}
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
