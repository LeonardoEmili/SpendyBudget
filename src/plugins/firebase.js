import firebase from 'firebase'
import router from '../router/index.js'
import * as utils from '../utils'

// Web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBWFn7YZi8syAr1PMbW90A97hCoxXz-oe0",
    authDomain: "spendybudget.firebaseapp.com",
    databaseURL: "https://spendybudget.firebaseio.com",
    projectId: "spendybudget",
    storageBucket: "spendybudget.appspot.com",
    messagingSenderId: "1054189573271",
    appId: "1:1054189573271:web:b61efa9175b36545a6c5d2",
    measurementId: "G-G5Z5EKNL29"
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
firebase.analytics()



// --------------- Define calls to Google Cloud Functions down here

export const logout = function () {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "http://localhost:16492/spendybudget/us-central1/logout", true);
    //xmlHttp.open("GET", "https://us-central1-spendybudget.cloudfunctions.net/logout", true);
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + localStorage.authToken);
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState === 4) {
            console.log("You have been successfully logged out!");
        }
    };
    xmlHttp.send();
}


export const loginWithEmailAndPassword = function (user, handleResponse) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "http://localhost:16492/spendybudget/us-central1/loginWithEmailAndPassword", true);
    //xmlHttp.open("POST", "https://us-central1-spendybudget.cloudfunctions.net/loginWithEmailAndPassword", true);

    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState === 4) {
            handleResponse(xmlHttp);
        }
    };
    xmlHttp.send(JSON.stringify(user));
}

// TODO: handle functions authentication here (issue #3)
/*export const authenticateFunction = function (name) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "http://localhost:16492/spendybudget/us-central1/authenticateFunction", true);
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState === 4) {
            handleResponse(xmlHttp);
        }
    };
}*/

/**
 * Attempts a bearer authentication (a.k.a. token-based authentication) using the 
 * "Authorization" request header field with the "Bearer" HTTP authorization scheme.
 */
export const signInSilently = async function () {

    // If there is no active session, redirecting to the welcome page
    if (localStorage.authToken === undefined) {
        console.log("No active session");
        utils.resetSession();
        return;
    }

    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "http://localhost:16492/spendybudget/us-central1/signInSilently", true);
    //xmlHttp.open("GET", "https://us-central1-spendybudget.cloudfunctions.net/signInSilently", true);
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + localStorage.authToken);
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState === 4) {
            let response = JSON.parse(xmlHttp.responseText);
            if (response.error !== undefined) {
                console.log(response.error);
                utils.resetSession();
                return;
            }
            console.log("Successfully signed-in silently! Here's the user:\n" + xmlHttp.responseText);
            router.replace("/home").catch(() => { });

        }
    };
    xmlHttp.send();
}


export function loadWallets(onSuccess) {
    let xmlHttp = new XMLHttpRequest()
    xmlHttp.open("GET", "http://localhost:16492/spendybudget/us-central1/loadWallets", true)
    //xmlHttp.open("GET", "https://us-central1-spendybudget.cloudfunctions.net/loadWallets", true);
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + localStorage.authToken)
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState === 4) {
            const wallets = JSON.parse(xmlHttp.responseText)
            if (typeof (wallets) === 'object' && 'error' in wallets) {
                console.log(wallets.error)
                utils.resetSession()
                return
            }
            onSuccess(wallets)
        }
    }
    xmlHttp.send()
}

export function createNewWallet(newWallet, onSuccess) {
    let xmlHttp = new XMLHttpRequest()
    xmlHttp.open("POST", "http://localhost:16492/spendybudget/us-central1/createNewWallet", true)
    //xmlHttp.open("POST", "https://us-central1-spendybudget.cloudfunctions.net/createNewWallet", true);
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + localStorage.authToken)
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState === 4) {
            const wallet = JSON.parse(xmlHttp.responseText)
            if ('error' in wallet) {
                console.log(wallet.error)
                utils.resetSession()
                return
            }
            onSuccess(wallet)
        }
    }
    xmlHttp.send(JSON.stringify(newWallet))
}