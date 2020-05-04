// General purpose utility function

// 

// --------- Utility functions for the integration with Firebase

import * as functions from './plugins/firebase'
import router from './router/index.js'

/**
 * Wrapper of the [firebase.signInSilently] function.
 */
export function signInSilently() {
    const authToken = localStorage.authToken;

    if (authToken === undefined) {
        router.replace("/").catch(() => { });
        return;
    }


    functions.signInSilently(authToken, function (data) {
        console.log("Successfully signed-in silently! Here's the user:\n" + response);
        let response = JSON.parse(data);
        if (response.error !== undefined) {
            console.log(response.error);
            localStorage.removeItem("authToken");
            router.replace("/").catch(() => { });
        }
        router.replace("/home").catch(() => { });
    });
}