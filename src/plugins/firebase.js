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

//const cors = require('cors')({ origin: true });

/**
 * Define Google Cloud Functions down here
 */

//export const loginWithEmailAndPassword = firebase.functions().httpsCallable("loginWithEmailAndPassword");

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


/*
xmlHttp.open("GET", "http://localhost:16492/spendybudget/us-central1/hello");
    xmlHttp.send();
    xmlHttp.onreadystatechange = () => {
        //console.log(xmlHttp.readyState);
        console.log(xmlHttp.responseText);

    };
*/