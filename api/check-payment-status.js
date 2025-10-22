// api/check-payment-status.js
const firebase = require('firebase-admin');

// --- Firebase Admin Initialization (Copy from payment-webhook.js or use a shared init file) ---
if (!firebase.apps.length) {
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
         firebase.initializeApp({ credential: firebase.credential.applicationDefault() });
    } else {
         try {
            const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
             firebase.initializeApp({
                 credential: firebase.credential.cert({
                     projectId: process.env.FIREBASE_PROJECT_ID,
                     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                     privateKey: privateKey,
                 })
             });
         } catch(e) { console.error("Firebase Admin initialization failed.", e); }
    }
}
const db = firebase.firestore();
// --- End Firebase Admin Initialization ---

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { orderId } = req.query; // Get orderId from query parameter (e.g., /api/check-payment-status?orderId=...)

    if (!orderId) {
        return res.status(400).json({ error: 'Missing orderId query parameter' });
    }

    try {
        const paymentDocRef = db.collection('payments').doc(orderId);
        const docSnap = await paymentDocRef.get();

        if (!docSnap.exists) {
            console.log(`Payment document not found for orderId: ${orderId}`);
            // Return PENDING or NOT_FOUND, depending on how you want to handle cases
            // where webhook might not have arrived yet or order is invalid.
            // Returning 'PENDING' might be safer initially.
            return res.status(200).json({ status: 'PENDING' });
            // Or return res.status(404).json({ status: 'NOT_FOUND', message: 'Payment record not found.' });
        }

        const paymentData = docSnap.data();
        const paymentStatus = paymentData.status; // Get the status saved by the webhook

        console.log(`Status check for ${orderId}: Found status ${paymentStatus}`);

        // Return the status found in Firestore
        res.status(200).json({ status: paymentStatus }); // e.g., { status: "SUCCESS" } or { status: "FAILED" }

    } catch (error) {
        console.error(`Error fetching payment status for ${orderId}:`, error);
        res.status(500).json({ error: 'Failed to fetch payment status', details: error.message });
    }
};
