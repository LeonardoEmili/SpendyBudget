const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

exports.loginWithEmailAndPassword = functions.https.onRequest(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    const data = JSON.parse(req.body)

    const email = data['email'];
    const password = data['password'];

    // Generate a new cookie if there isn't one or if it has expired
    const sessionToken = generateSessionToken();

    const user = await db.collection('users').where('email', '==', email).where('password', '==', password).get();
    if (user.docs.length === 1) {
        
        res.setHeader("Access-Control-Expose-Headers", "Set-Cookie3")
        const options = { maxAge: 30, httpOnly: true, secure: true };
        res.setHeader('Set-Cookie3', '__session=' + sessionToken);

        res.send(user.docs[0].data());
    } else {
        res.send('{"error": "User not found"}');
    }
});


exports.hello = functions.https.onRequest(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send("XDDD");
});


const SESSION_TOKEN_LENGTH = 64;

function generateSessionToken() {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < SESSION_TOKEN_LENGTH; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}