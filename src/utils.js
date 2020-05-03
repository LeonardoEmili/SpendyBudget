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

//function eraseCookie(name) {document.cookie = name + '=; Max-Age=-99999999;';}