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

/**
 * Cached user's data
 */
export let user = {
    name: "",
    surname: "",
    email: "",
    profPic: "",
};


const RELEASE = false;

// --------------- Define calls to Google Cloud Functions down here

export const logout = function () {
    let xmlHttp = new XMLHttpRequest();
    RELEASE ? xmlHttp.open("GET", "https://us-central1-spendybudget.cloudfunctions.net/logout", true) :
        xmlHttp.open("GET", "http://localhost:16492/spendybudget/us-central1/logout", true);

    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + localStorage.authToken);
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState === 4) {
            console.log("You have been successfully logged out!");
        }
    };
    xmlHttp.send();
}

export const signUpWithEmailAndPassword = function (user, handleResponse) {
    let xmlHttp = new XMLHttpRequest();
    RELEASE ? xmlHttp.open("POST", "https://us-central1-spendybudget.cloudfunctions.net/signUpWithEmailAndPassword", true) :
        xmlHttp.open("POST", "http://localhost:16492/spendybudget/us-central1/signUpWithEmailAndPassword", true);


    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState === 4) {
            handleResponse(xmlHttp);
        }
    };
    xmlHttp.send(JSON.stringify(user));
}

const RELEASE = false;


export const loginWithEmailAndPassword = function (user, handleResponse) {
    let xmlHttp = new XMLHttpRequest();
    RELEASE ? xmlHttp.open("POST", "https://us-central1-spendybudget.cloudfunctions.net/loginWithEmailAndPassword", true) :
        xmlHttp.open("POST", "http://localhost:16492/spendybudget/us-central1/loginWithEmailAndPassword", true);

    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState === 4) {
            handleResponse(xmlHttp);
        }
    };
    xmlHttp.send(JSON.stringify(user));
}

// TODO: handle functions authentication here (issue #3)
/*
export const authenticateFunction = function (name, method="GET", payload=null, handleResponse=null) {
    let xmlHttp = new XMLHttpRequest();

    if (method == "GET" && payload != null) {
        console.log("Malformed request: using payload with a GET request");
        return;
    }



    xmlHttp.open(method, "http://localhost:16492/spendybudget/us-central1/authenticateFunction", true);
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
    RELEASE ? xmlHttp.open("GET", "https://us-central1-spendybudget.cloudfunctions.net/signInSilently", true) :
        xmlHttp.open("GET", "http://localhost:16492/spendybudget/us-central1/signInSilently", true);

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
            router.replace("/dashboard").catch(() => { });
        }
    };
    xmlHttp.send();
}

/**
 * Fetches user data from Google Cloud Firestore.
 * @param {Function} onSuccess called when data is available
 */
export const fetchUserData = async function (onSuccess) {
    // If there is no active session, redirecting to the welcome page
    if (localStorage.authToken === undefined) {
        console.log("No active session");
        utils.resetSession();
        return;
    }
    let xmlHttp = new XMLHttpRequest();

    // Using signInSilently since they do the same identical operations
    RELEASE ? xmlHttp.open("GET", "https://us-central1-spendybudget.cloudfunctions.net/signInSilently", true) :
        xmlHttp.open("GET", "http://localhost:16492/spendybudget/us-central1/signInSilently", true);

    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + localStorage.authToken);
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState === 4) {
            let response = JSON.parse(xmlHttp.responseText);
            if (response.error !== undefined) {
                console.log(response.error);
                utils.resetSession();
                return;
            }
            if ("profPic" in response) {
                response["profPic"] = utils.b64DecodeUnicode(response["profPic"]);
            }
            onSuccess(response);
        }
    };
    xmlHttp.send();
}


export function loadWallets(onSuccess) {
    let xmlHttp = new XMLHttpRequest()
    RELEASE ? xmlHttp.open("GET", "https://us-central1-spendybudget.cloudfunctions.net/loadWallets", true) :
        xmlHttp.open("GET", "http://localhost:16492/spendybudget/us-central1/loadWallets", true);

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
    xmlHttp.send();
}

/**
 * Uploads the profile picture and stores it as a BLOB.
 * @param {String} blob utf-8 encoded image
 */
export function uploadProfilePhoto(blob) {
    let xmlHttp = new XMLHttpRequest()
    RELEASE ? xmlHttp.open("POST", "https://us-central1-spendybudget.cloudfunctions.net/uploadProfilePhoto", true) :
        xmlHttp.open("POST", "http://localhost:16492/spendybudget/us-central1/uploadProfilePhoto", true);

    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + localStorage.authToken)
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState === 4) {
            console.log(xmlHttp.responseText);

            //onSuccess(wallet)
        }
    }
    const encodedImg = utils.b64EncodeUnicode(blob);
    xmlHttp.send(encodedImg);
}

export function createNewWallet(newWallet, onSuccess) {
    let xmlHttp = new XMLHttpRequest();
    RELEASE ? xmlHttp.open("POST", "https://us-central1-spendybudget.cloudfunctions.net/createNewWallet", true) :
        xmlHttp.open("POST", "http://localhost:16492/spendybudget/us-central1/createNewWallet", true);

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

export function createNewTransaction(walletId, newTransaction, onSuccess) {
    let xmlHttp = new XMLHttpRequest();
    RELEASE ? xmlHttp.open("POST", "https://us-central1-spendybudget.cloudfunctions.net/createNewTransaction", true) :
        xmlHttp.open("POST", "http://localhost:16492/spendybudget/us-central1/createNewTransaction", true);

    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + localStorage.authToken)
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState === 4) {
            const transaction = JSON.parse(xmlHttp.responseText)
            if ('error' in transaction) {
                console.log(transaction.error)
                utils.resetSession()
                return
            }
            onSuccess(transaction)
        }
    }
    xmlHttp.send(JSON.stringify({
        walletId: walletId,
        transaction: newTransaction
    }))

}