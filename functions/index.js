const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

exports.loginWithEmailAndPassword = functions.https.onRequest(async (req, res) => {
    const email = req.body['email'];
    const password = req.body['password'];

    // Generate a new cookie if there isn't one or if it has expired
    const sessionCookie = generateSessionCookie();

    const user = await db.collection('users').where('email', '==', email).where('password', '==', password).get();
    if (user.docs.length === 1) {
        res.setHeader("Set-Cookie", "_session=" + sessionCookie);
        res.send(user.docs[0].data());
    }
    res.send('{"error": "User not found"}');
});



const COOKIE_LENGTH = 64;

function generateSessionCookie() {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < COOKIE_LENGTH; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}