const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

exports.loginWithEmailAndPassword = functions.https.onRequest(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    //res.setHeader("Access-Control-Expose-Headers", "Transfer-Encoding");
    res.setHeader('Set-Cookie: cross-site-cookie=Set-Cookie; SameSite=None; Secure');
    const data = JSON.parse(req.body)

    const email = data['email'];
    const password = data['password'];

    // Generate a new cookie if there isn't one or if it has expired
    const sessionCookie = generateSessionCookie();

    const user = await db.collection('users').where('email', '==', email).where('password', '==', password).get();
    if (user.docs.length === 1) {

        let resData = {};
        
        resData["__session"] = generateSessionCookie();

        //res.cookie("Set-Cookie", "__session=" + sessionCookie);
        //res.cookie('Set-Cookie', 'cookievalue', { maxAge: 900000, httpOnly: true });

        //res.setHeader("Set-Cookie", "__session=" + sessionCookie);

        resData["user"] = user.docs[0].data();
        res.send(resData);
    } else {
        res.send('{"error": "User not found"}');
    }
});


exports.hello = functions.https.onRequest(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send("XDDD");
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