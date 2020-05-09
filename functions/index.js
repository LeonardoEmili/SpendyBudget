const functions = require('firebase-functions');
const admin = require('firebase-admin');
const FieldValue = admin.firestore.FieldValue;

admin.initializeApp();

const db = admin.firestore();

exports.loginWithEmailAndPassword = functions.https.onRequest(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    const data = JSON.parse(req.body)
    const email = data['email'];
    const password = data['password'];

    // Generate a new cookie if there isn't one or if it has expired
    const authToken = generateAuthToken();

    const snaps = await db.collection('users').where('email', '==', email).where('password', '==', password).limit(1).get();
    if (snaps.docs.length === 1) {

        const user = snaps.docs[0];

        // Auth tokens stored in Firestore
        let authTokens = user.data()["authTokens"] || [];
        authTokens.push(authToken);

        db.collection('users').doc(user.id).update({ "authTokens": authTokens });
        res.setHeader("Access-Control-Expose-Headers", "Authentication")
        res.setHeader('Authentication', authToken);
        res.send(user.data());
    } else {
        res.send('{"error": "Wrong email address or password"}');
    }
});

exports.signUpWithEmailAndPassword = functions.https.onRequest(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    const data = JSON.parse(req.body)
    const email = data['email'];
    const password = data['password'];

    // Check if already exists a user with that email
    const snaps = await db.collection('users').where('email', '==', email).limit(1).get();
    if (snaps.docs.length === 0) {

        // Create the user
        const authToken = generateAuthToken();
        const user = {
            email: email,
            password: password,
            authTokens: [authToken]
        };

        db.collection('users').add(user);
        res.setHeader("Access-Control-Expose-Headers", "Authentication")
        res.setHeader('Authentication', authToken);
        res.send('{}');
    } else {
        res.send('{"error": "Email address already in use"}');
    }
});


exports.signInSilently = functions.https.onRequest(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Authorization");

    const userDoc = await authenticateRequest(req);
    if (userDoc === null) {
        res.send({ "error": "Invalid auth token" });
        return;
    }

    const user = userDoc.data();
    res.send(user);

});

function parseUserData(data) {
    let result = {
        ...data["name"] && { name: data["name"] },
        ...data["surname"] && { surname: data["surname"] },
        ...data["profPic"] && { profPic: data["profPic"] },
        ...data["email"] && { email: data["email"] },
        ...data["password"] && { password: data["password"] },
        ...data["birthdate"] && { birthdate: data["birthdate"] }
    };
    return result;
}

exports.updateUserData = functions.https.onRequest(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Authorization");

    const userDoc = await authenticateRequest(req);
    if (userDoc === null) {
        res.send({ "error": "Invalid auth token" });
        return;
    }

    const data = JSON.parse(req.body)
    const userData = parseUserData(data);
    await db.collection('users').doc(userDoc.id).update(userData);

    res.send({ "message": "User data updated successfully" });
});

exports.uploadProfilePhoto = functions.https.onRequest(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Authorization");

    const userDoc = await authenticateRequest(req);
    if (userDoc === null) {
        res.send({ "error": "Invalid auth token" });
        return;
    }

    await db.collection('users').doc(userDoc.id).update({ "profPic": req.body });
    res.send({ "message": "Image uploaded successfully" });
});

exports.loadWallets = functions.https.onRequest(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Authorization");

    const userDoc = await authenticateRequest(req);
    if (userDoc === null) {
        res.send({ "error": "Invalid auth token" });
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

exports.logout = functions.https.onRequest(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Authorization");

    const userDoc = await authenticateRequest(req);
    if (userDoc === null) {
        res.send({ "error": "Invalid auth token" });
        return;
    }

    const token = parseAuthToken(req.headers.authorization);
    await db.collection("users").doc(userDoc.id).update({ "authTokens": FieldValue.arrayRemove(token) });
    res.send();
});

exports.createNewWallet = functions.https.onRequest(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Authorization");

    const userDoc = await authenticateRequest(req);
    if (userDoc === null) {
        res.send({ "error": "Invalid auth token" });
        return;
    }

    const data = JSON.parse(req.body);

    let wallet = {
        name: data.name,
        currency: data.currency,
        balanceEUR: 0.0,
        budget: {
            budgetEUR: 0.0,
            expiryDate: admin.firestore.Timestamp.fromMillis(0)
        },
        transactions: []
    }

    const doc = await db.collection('users')
        .doc(userDoc.id)
        .collection("wallets")
        .add(wallet)


    wallet["id"] = doc.id
    res.send(wallet)
});

exports.createNewTransaction = functions.https.onRequest(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Authorization");

    const userDoc = await authenticateRequest(req);
    if (userDoc === null) {
        res.send({ "error": "Invalid auth token" });
        return;
    }

    const data = JSON.parse(req.body);

    let transaction = {
        description: data.transaction.description,
        amount: data.transaction.amount,
        instant: admin.firestore.Timestamp.now()
    }

    const addition = data.transaction.amount >= 0 ? data.transaction.amount : 0

    const doc = await db.collection('users')
        .doc(userDoc.id)
        .collection("wallets")
        .doc(data.walletId)
        .update({
            transactions: admin.firestore.FieldValue.arrayUnion(transaction),
            balanceEUR: admin.firestore.FieldValue.increment(data.transaction.amount),
            "budget.spentEUR": admin.firestore.FieldValue.increment(addition)
        })

    res.send(transaction)
});



exports.editBudget = functions.https.onRequest(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Authorization");

    const userDoc = await authenticateRequest(req);
    if (userDoc === null) {
        res.send({ "error": "Invalid auth token" });
        return;
    }

    const data = JSON.parse(req.body);

    let budget = {
        budgetEUR: data.budget.budgetEUR,
        expiryDate: admin.firestore.Timestamp.fromMillis(data.budget.expiryDate),
        spentEUR: 0.0
    }

    const doc = await db.collection('users')
        .doc(userDoc.id)
        .collection("wallets")
        .doc(data.walletId)
        .set({
            budget: budget
        }, {merge: true})

    res.send(budget)
});

/**
 * Returns the auth token extracted from the Bearer authentication scheme.
 * @param {String} token the authentication token
 */
function parseAuthToken(tokenScheme) {
    return String(tokenScheme).split("Bearer ")[1];
}


/**
 * Authenticates the request and returns the user related to the provided authentication token.
 * @param {Request} req the incoming HTTP request
 */
async function authenticateRequest(req) {
    if (req.headers.authorization === null || req.headers.authorization === undefined) {
        // Check whether such authentication token is provided
        return null;
    }
    const authToken = parseAuthToken(req.headers.authorization);
    const userDoc = await getUserDocByAuthToken(authToken);
    return userDoc;
}

/**
 * Gets the [user document] associated with the given [authToken].
 * If no user has that auth token, returns null.
  * @param {String} authToken 
 */
async function getUserDocByAuthToken(authToken) {

    if (authToken === null || authToken === undefined) {
        return null;
    }

    const snaps = await db.collection('users')
        .where('authTokens', 'array-contains', authToken)
        .limit(1)
        .get();

    // No user found with the given auth token.
    if (snaps.docs.length === 0) {
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