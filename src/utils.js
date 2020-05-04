import router from './router'

// General purpose utility function

export function removeAuth() {
    localStorage.removeItem("authToken")
}

export function resetSession() {
    removeAuth()
    router.replace("/").catch(() => { });
}

export function convertFromEUR(value, currency) {
    switch (currency) {
        case "USD":
            return (value * 1.09).toFixed(2);

        default:
            return value.toFixed(2);
    }
}