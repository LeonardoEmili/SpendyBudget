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

    const snaps = await db.collection('users').where('email', '==', email).where('password', '==', password).get();
    if (snaps.docs.length === 1) {

        const user = snaps.docs[0];

        // Sessions tokens stored in Firestore
        let sessions = user.data()["sessions"] || [];
        sessions.push(sessionToken);

        db.collection('users').doc(user.id).update({ "sessions": sessions });
        res.setHeader("Access-Control-Expose-Headers", "Set-Cookie1")
        res.setHeader('Set-Cookie1', '__session=' + sessionToken);
        res.send(user.data());
    } else {
        res.send('{"error": "User not found"}');
    }
});


exports.hello = functions.https.onRequest(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send("XDDD");
});

exports.signInSilently = functions.https.onRequest(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    //res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
    //res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

    //res.send("AJEJE");
    //req.get('Set-Cookie')
    res.send(req.headers.authorization);


    //res.send(req.get('Set-Cookie3'));
});

/**
 * Gets the [user] associated with the given [sessionToken].
 * If no user has that session token, returns null.
  * @param {String} sessionToken 
 */
async function getUserBySessionToken(sessionToken) {
    const snaps = await db.collection('users')
        .where('sessions', 'array-contains', sessionToken)
        .limit(1)
        .get();

    // No user found.
    if (snaps.docs.length == 0) {
        return null;
    }

    return snaps.docs[0].data();
}


const SESSION_TOKEN_LENGTH = 64;

function generateSessionToken() {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < SESSION_TOKEN_LENGTH; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}