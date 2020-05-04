/**
 * Returns the value of a cookie given its name.
 * @param {String} name  the value that identifies the cookie
 */
export function getCookie(name) {
    let result = null;
    const cookies = document.cookie.split(';');
    cookies.forEach((c) => {
        let cookie = c.trim();
        if (cookie.startsWith(name + "=")) {
            result = cookie.substring(name.length + 1, cookie.length);
        }
    });

    return result;
}

/**
 * Returns all non-null cookies
 */
export function getCookies() {
    return document.cookie.split(";").map(cookie => cookie.trim()).filter(cookie => String(cookie) != "null")
}

export function clearCookies() {
    getCookies().forEach(eraseCookie)
}

/**
 * Deletes a cookie from its name.
 * @param {String} name the value that identifies the cookie
 */
export function eraseCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

// --------- Utility functions for the integration with Firebase

import * as functions from './plugins/firebase'

/**
 * Wrapper of the [firebase.signInSilently] function.
 */
export function signInSilently() {
    let authToken = getCookie("__token");
    functions.signInSilently(authToken);
    if (authToken != null) {
        //functions.signInSilently(authToken);
    }
}