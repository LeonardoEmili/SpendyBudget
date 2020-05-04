import firebase from 'firebase'

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


export const loginWithEmailAndPassword = function (user, handleResponse) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "http://localhost:16492/spendybudget/us-central1/loginWithEmailAndPassword", true);
    //xmlHttp.open("POST", "https://us-central1-spendybudget.cloudfunctions.net/loginWithEmailAndPassword");

    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState == 4) {
            handleResponse(xmlHttp);
        }
    };
    xmlHttp.send(JSON.stringify(user));
}

/**
 * Attempts a bearer authentication (a.k.a. token-based authentication) using the 
 * "Authorization" request header field with the "Bearer" HTTP authorization scheme.
 * @param {String} authToken the security token used to login
 */
export const signInSilently = async function (authToken) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "http://localhost:16492/spendybudget/us-central1/signInSilently", true);
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + authToken);
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState == 4) {
            console.log(xmlHttp.responseText);
        }
    };
    xmlHttp.send();
}

export const hello = function () {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "http://localhost:16492/spendybudget/us-central1/hello");
    xmlHttp.withCredentials = true;
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
            console.log(xmlHttp);
        }
    };
    xmlHttp.send();
}