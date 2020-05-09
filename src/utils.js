import router from './router'
import * as functions from './plugins/firebase'
import { app } from './main'

// General purpose utility function

/**
 * Resets the current user session (client side only).
 */
export function resetSession() {
    localStorage.removeItem("authToken")
    router.replace("/").catch(() => { });
}

/**
 * Performs the logout of the current logged user.
 */
export function logout() {
    functions.logout();
    resetSession();
}

/**
 * Utility function to check wheter we are using a mobile browser.
 */
export function isMobileView() {
    return screen.width <= 600;
}

/**
 * Returns the image encoded in base-64 format.
 * @param {String} str the Unicode encoded image
 */
export function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

/**
 * Returns the image encoded in Unicode format.
 * @param {Base64} str the base64 encoded img
 */
export function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
        }));
}

/**
 * Fetches the user's profile picture from cache if present, otherwise queries Firestore.
 * @param {Function} onSuccess called when data is available
 * @param {Boolean} forceUpdate force update the data available
 */
export function fetchUserProfilePicture(onSuccess, forceUpdate = false) {
    if (app.user.profPic) {
        onSuccess(app.user.profPic);
    } else {
        fetchUserData(user => onSuccess(user.profPic), forceUpdate);
    }
}

/**
 * Fetches the user's name from cache if present, otherwise queries Firestore.
 * @param {Function} onSuccess called when data is available
 * @param {Boolean} forceUpdate force update the data available
 */
export function fetchUserName(onSuccess, forceUpdate = false) {
    if (app.user.name) {
        onSuccess(app.user.name);
    } else {
        fetchUserData(user => onSuccess(user.name), forceUpdate);
    }
}


/**
 * Fetches the user's surname from cache if present, otherwise queries Firestore.
 * @param {Function} onSuccess called when data is available
 * @param {Boolean} forceUpdate force update the data available
 */
export function fetchUserSurname(onSuccess, forceUpdate = false) {
    if (app.user.surname) {
        onSuccess(app.user.surname);
    } else {
        fetchUserData(user => onSuccess(user.surname), forceUpdate);
    }
}


/**
 * Fetches the user's password (hashed) from cache if present, otherwise queries Firestore.
 * @param {Function} onSuccess called when data is available
 * @param {Boolean} forceUpdate force update the data available
 */
export function fetchUserPassword(onSuccess, forceUpdate = false) {
    if (app.user.password) {
        onSuccess(app.user.password);
    } else {
        fetchUserData(user => onSuccess(user.password), forceUpdate);
    }
}


/**
 * Fetches the user's email from cache if present, otherwise queries Firestore.
 * @param {Function} onSuccess called when data is available
 * @param {Boolean} forceUpdate force update the data available
 */
export function fetchUserEmail(onSuccess, forceUpdate = false) {
    if (app.user.email) {
        onSuccess(app.user.email);
    } else {
        fetchUserData(user => onSuccess(user.email), forceUpdate);
    }
}


/**
 * Fetches the user's birthdate from cache if present, otherwise queries Firestore.
 * @param {Function} onSuccess called when data is available
 * @param {Boolean} forceUpdate force update the data available
 */
export function fetchUserBirthdate(onSuccess, forceUpdate = false) {
    if (app.user.birthdate) {
        onSuccess(app.user.birthdate);
    } else {
        fetchUserData(user => onSuccess(user.birthdate), forceUpdate);
    }
}

/**
 * Fetches the user's gender from cache if present, otherwise queries Firestore.
 * @param {Function} onSuccess called when data is available
 * @param {Boolean} forceUpdate force update the data available
 */
export function fetchUserGender(onSuccess, forceUpdate = false) {
    if (app.user.gender) {
        onSuccess(app.user.gender);
    } else {
        fetchUserData(user => onSuccess(user.gender), forceUpdate);
    }
}


/**
 * Fetches all the user's data from Firestore and updates local data.
 * @param {Function} onSuccess called when data is available
 * @param {Boolean} forceUpdate force update the data available
 */
export function fetchUserData(onSuccess, forceUpdate = false) {

    let shouldFetchNewData = forceUpdate || app.user.name === "" || app.user.surname === "" || app.user.email === "" || app.user.profPic === "";
    if (!shouldFetchNewData) {
        onSuccess(app.user);
        return;
    }

    functions.fetchUserData(userDoc => {
        // TODO: check if there are errors processing the HTTP request

        app.user.name = (userDoc.name && userDoc.name.length > 0) ? userDoc.name : app.user.name;
        app.user.surname = (userDoc.surname && userDoc.surname.length > 0) ? userDoc.surname : app.user.surname;
        app.user.email = (userDoc.email && userDoc.email.length > 0) ? userDoc.email : app.user.email;
        app.user.profPic = (userDoc.profPic && userDoc.profPic.length > 0) ? userDoc.profPic : app.user.profPic;

        onSuccess(app.user);
    });
}

/**
 * Converts the value into the desidered currency.
 * @param {Number} value the value to be converted in [currency]
 * @param {String} currency in ["EUR", "USD"]
 */
export function convertFromEUR(value, currency) {
    switch (currency) {
        case "USD":
            return parseFloat((value * 1.09).toFixed(2));
        case "EUR":
        default:
            return parseFloat(value.toFixed(2));
    }
}

/**
 * Converts the value into the desidered currency.
 * @param {Number} value the value to be converted in [currency]
 * @param {String} currency in ["EUR", "USD"]
 */
export function convertToEUR(value, currency) {
    switch (currency) {
        case "USD":
            return parseFloat((value * 0, 92).toFixed(2));
        case "EUR":
        default:
            return parseFloat(value.toFixed(2));
    }
}