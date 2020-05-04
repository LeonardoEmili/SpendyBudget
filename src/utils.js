import router from './router'

// General purpose utility function

export function removeAuth() {
    localStorage.removeItem("authToken")
}

export function resetSession() {
    removeAuth()
    router.replace("/").catch(() => { });
}