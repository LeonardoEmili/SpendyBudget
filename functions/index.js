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
    const authToken = generateAuthToken();

    const snaps = await db.collection('users').where('email', '==', email).where('password', '==', password).get();
    if (snaps.docs.length === 1) {

        const user = snaps.docs[0];

        // Auth tokens stored in Firestore
        let authTokens = user.data()["authTokens"] || [];
        authTokens.push(authToken);

        db.collection('users').doc(user.id).update({ "authTokens": authTokens });
        res.setHeader("Access-Control-Expose-Headers", "Authentication")
        res.setHeader('Authentication',  authToken);
        res.send(user.data());
    } else {
        res.send('{"error": "User not found"}');
    }
});

exports.signInSilently = functions.https.onRequest(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");

    const authToken = String(req.headers.authorization).split("Bearer ")[1];
    const userDoc = await getUserDocByAuthToken(authToken);
    if (userDoc === null) {
        res.send( {"error": "Invalid auth token"});
        return;
    }
    const user = userDoc.data();
    res.send(user);

});

exports.loadWallets = functions.https.onRequest(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");

    const authToken = String(req.headers.authorization).split("Bearer ")[1];
    const userDoc = await getUserDocByAuthToken(authToken);
    
    if (userDoc === null) {
        res.send( {"error": "Invalid auth token"});
        return;
    }

    const snaps = await db.collection('users')
        .doc(userDoc.id)
        .collection("wallets")
        .get();

    let wallets = [];

    snaps.forEach(snap => {
        let wallet = snap.data()
        wallet["id"] = snap.id
        wallets.push(wallet);
    });

    res.send(wallets);

});


exports.createNewWallet = functions.https.onRequest(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");

    const authToken = String(req.headers.authorization).split("Bearer ")[1];
    const userDoc = await getUserDocByAuthToken(authToken);
    
    if (userDoc === null) {
        res.send( {"error": "Invalid auth token"});
        return;
    }

    let wallet = {
        name: req.body.name,
        currency: req.body.currency,
        balanceEUR: 0.0,
        budget: {
            budgetEUR: 0.0,
            expiryDate: new admin.firestore.Timestamp(seconds = 0)
        }
    }

    const doc = await db.collection('users')
        .doc(userDoc.id)
        .collection("wallets")
        .add(wallet)
    

    wallet["id"] = doc.id

    res.send(wallet)
});

/**
 * Gets the [user document] associated with the given [authToken].
 * If no user has that auth token, returns null.
  * @param {String} authToken 
 */
async function getUserDocByAuthToken(authToken) {

    if (authToken == null) {
        return null;
    }

    const snaps = await db.collection('users')
        .where('authTokens', 'array-contains', authToken)
        .limit(1)
        .get();

    // No user found with the given auth token.
    if (snaps.docs.length == 0) {
        return null;
    }

    return snaps.docs[0];
}


const AUTH_TOKEN_LENGTH = 64;

function generateAuthToken() {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < AUTH_TOKEN_LENGTH; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}