/**
 * Returns the value of a cookie given its name.
 * @param {*} name  the value that identifies the cookie
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
 * @param {*} name the value that identifies the cookie
 */
export function eraseCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}