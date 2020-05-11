import firebase from 'firebase'
import router from '../router/index.js'
import * as utils from '../utils'
import { app } from '../main.js'

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
export let user;

const RELEASE = process.env.NODE_ENV === "production"

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
    initUserData();
    let xmlHttp = new XMLHttpRequest();
    RELEASE ? xmlHttp.open("POST", "https://us-central1-spendybudget.cloudfunctions.net/signUpWithEmailAndPassword", true) :
        xmlHttp.open("POST", "http://localhost:16492/spendybudget/us-central1/signUpWithEmailAndPassword", true);


    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState === 4) {
            utils.updateLocalUser(user);
            handleResponse(xmlHttp);
        }
    };
    xmlHttp.send(JSON.stringify(user));
}

export const loginWithEmailAndPassword = function (user, handleResponse) {
    initUserData();
    let xmlHttp = new XMLHttpRequest();
    RELEASE ? xmlHttp.open("POST", "https://us-central1-spendybudget.cloudfunctions.net/loginWithEmailAndPassword", true) :
        xmlHttp.open("POST", "http://localhost:16492/spendybudget/us-central1/loginWithEmailAndPassword", true);

    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState === 4) {
            let response = JSON.parse(xmlHttp.responseText);
            if (response.profPic) {
                // Encode the profile picture before using it
                response.profPic = utils.b64DecodeUnicode(response.profPic);
            }
            utils.updateLocalUser(response);
            // TODO: pass JSON directly here
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
    initUserData();

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
            console.log("Successfully signed-in silently! Welcome back " + response.email);

            if (response.profPic) {
                // Decode the profile picture before using it
                response.profPic = utils.b64DecodeUnicode(response.profPic);
            }
            utils.updateLocalUser(response);
            router.replace("/dashboard").catch(() => { });
        }
    };
    xmlHttp.send();
}

/**
 * Fetches and returns user data from Google Cloud Firestore.
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
 * 
 * @param {Object} data the user's data to be updated
 */
export function updateUserData(data) {
    let xmlHttp = new XMLHttpRequest()
    RELEASE ? xmlHttp.open("POST", "https://us-central1-spendybudget.cloudfunctions.net/updateUserData", true) :
        xmlHttp.open("POST", "http://localhost:16492/spendybudget/us-central1/updateUserData", true);
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + localStorage.authToken)
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState === 4) {
            if (data.profPic) {
                data.profPic = utils.b64DecodeUnicode(data.profPic);
            }
            utils.updateLocalUser(data);
            console.log(xmlHttp.responseText);
        }
    }

    if (data.profPic) {
        // Encode the profile picture before sending it
        data.profPic = utils.b64EncodeUnicode(data.profPic);
    }

    console.log(JSON.stringify(data).length);
    xmlHttp.send(JSON.stringify(data));
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
            // Update local copy of the profile picture
            app.user.profPic = blob;
        }
    }
    const encodedImg = utils.b64EncodeUnicode(blob);
    console.log(encodedImg.length);
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

export function editBudget(walletId, newBudget, onSuccess) {
    let xmlHttp = new XMLHttpRequest();
    RELEASE ? xmlHttp.open("POST", "https://us-central1-spendybudget.cloudfunctions.net/editBudget", true) :
        xmlHttp.open("POST", "http://localhost:16492/spendybudget/us-central1/editBudget", true);

    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + localStorage.authToken)
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState === 4) {
            const budget = JSON.parse(xmlHttp.responseText)
            if ('error' in budget) {
                console.log(budget.error)
                utils.resetSession()
                return
            }
            onSuccess(budget)
        }
    }
    xmlHttp.send(JSON.stringify({
        walletId: walletId,
        budget: newBudget
    }))

}

/**
 * Initializes the local copy of the user's data.
 */
export function initUserData() {
    app.user = {
        name: "",
        surname: "",
        password: "",
        email: "",
        profPic: "",
        birthdate: "",
        gender: "",
        locale: ""
    };
}