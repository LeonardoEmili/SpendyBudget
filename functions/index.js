const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();


exports.loginWithEmailAndPassword = functions.https.onCall(async (data, context) => {
    const email = data['email'];
    const password = data['password'];
    const user = await db.collection('users').where('email', '==', email).where('password', '==', password).get();
    if (user.docs.length === 1) {
        return user.docs[0].data();
    }
    return null;

});