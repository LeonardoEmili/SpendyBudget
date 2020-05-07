import router from './router'
import * as functions from './plugins/firebase'

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

export function isMobileView() {
    return screen.width <= 600;
}

/**
 * Converts the value into the desidered currency.
 * @param {Number} value the value to be converted in [currency]
 * @param {String} currency in ["EUR", "USD"]
 */
export function convertFromEUR(value, currency) {
    switch (currency) {
        case "USD":
            return (value * 1.09).toFixed(2);
        case "EUR":
        default:
            return value.toFixed(2);
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
            return (value * 0,92).toFixed(2);
        case "EUR":
        default:
            return value.toFixed(2);
    }
}