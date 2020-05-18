import router from './router'
import * as functions from './plugins/firebase'
import { app } from './main'
import i18n from "./plugins/i18n-vue";

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
 * Utility function to check whether we are using a mobile browser.
 */
export function isMobileView() {
    return window.innerWidth <= 800;
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
 * Utility function that updates the local copy of user's data.
 * @param {Object} data the new data
 */
export function updateLocalUser(data) {
    app.user.name = data.name || app.user.name;
    app.user.surname = data.surname || app.user.surname;
    app.user.email = data.email || app.user.email;
    app.user.password = data.password || app.user.password;
    app.user.profPic = data.profPic || app.user.profPic;
    app.user.locale = data.locale || app.user.locale;
    app.user.gender = data.gender || app.user.gender;
    app.user.birthdate = data.birthdate || app.user.birthdate;
    app.user.currency = data.currency || app.user.currency;
    app.user.revenueCategories = data.revenueCategories || app.user.revenueCategories;
    app.user.expenseCategories = data.expenseCategories || app.user.expenseCategories;
    changeLanguage(app.user.locale);
}

/**
 * Returns the language to be used, which is either the user's preference or the language used from the browser.
 */
function getFallbackLocale() {
    let userPreference = localStorage.getItem("userLocale");
    if (userPreference) {
        return userPreference;
    }
    const isoList = locales.map((locale) => locale.iso);
    const userLocales = navigator.languages.filter((locale) => isoList.includes(locale.toLowerCase()));
    return userLocales[0].split('-')[0].toLowerCase() || "en";

}

/**
 * Returns the language corresponding to the input iso (if available)
 * @param {String} iso the code representing the language (ISO 639)
 */
export function languageFromISO(iso) {
    const ISO = iso.toLowerCase();
    return locales.filter((locale) => locale.iso === ISO)[0].name;
}

/**
 * Converts a PNG to JPEG file.
 * @param {File} image the image to converted
 * @param {Function} onSuccess called when the conversion is completed
 */
export function pngToJpeg(image, onSuccess) {
    // Load the image into an <img> tag
    const img = document.createElement("img");
    img.onload = function () {
        // Paint the PNG into a 2d plane
        let canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;

        // Store white pixels instead of transparency
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = "#FFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Once the image is ready, convert it to BASE64 format
        ctx.drawImage(this, 0, 0);
        let resultImage = canvas.toDataURL("image/jpeg");
        onSuccess(resultImage);
    }
    img.src = image;
}

/**
 * 
 * @param {File} file the image to be resized
 * @param {Croppie} croppie an instance of croppie
 * @param {Function} onSuccess called when the process is completed
 */
export function resizeImage(file, croppie, onSuccess) {
    const reader = new FileReader();

    reader.onload = evt => {
        const sourceImage = evt.target.result;
        if (isPNG(file.name)) {
            // In order:
            // 1. PNG -> JPGE
            // 2. Resize the image
            // 3. Return it.
            pngToJpeg(sourceImage, jpeg => croppie.bind({ url: jpeg }).then(() => crop(croppie, onSuccess)));
        } else {
            // Same as before, but avoid step. 1
            croppie.bind({ url: sourceImage }).then(() => crop(croppie, onSuccess));
        }
    };
    reader.readAsDataURL(file);
}

export function crop(croppie, onSuccess) {
    // Current option will return a base64 version of the uploaded image with a size of 256px X 256px.
    let options = {
        type: "base64",
        size: { width: 256, height: 256 },
        format: "jpeg"
    };
    croppie.result(options, output => onSuccess(output));
}

/**
 * Checks wheter a file endswith '.png' or '.PNG'
 * @param {String} filename the filename
 */
export function isPNG(filename) {
    return filename.split(".").pop().toLowerCase() === "png";
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
 * Fetches the user's revenue categories from cache if present, otherwise queries Firestore.
 * @param {Function} onSuccess called when data is available
 * @param {Boolean} forceUpdate force update the data available
 */
export function fetchUserRevenueCategories(onSuccess, forceUpdate = false) {
    if (app.user.revenueCategories) {
        onSuccess(app.user.revenueCategories);
    } else {
        fetchUserData(user => onSuccess(user.revenueCategories), forceUpdate);
    }
}

/**
 * Fetches the user's expense categories from cache if present, otherwise queries Firestore.
 * @param {Function} onSuccess called when data is available
 * @param {Boolean} forceUpdate force update the data available
 */
export function fetchUserExpenseCategories(onSuccess, forceUpdate = false) {
    if (app.user.expenseCategories) {
        onSuccess(app.user.expenseCategories);
    } else {
        fetchUserData(user => onSuccess(user.expenseCategories), forceUpdate);
    }
}

/**
 * Fetches the user's locale from cache if present, otherwise queries Firestore.
 * @param {Function} onSuccess called when data is available
 * @param {Boolean} forceUpdate force update the data available
 */
export function fetchUserLocale(onSuccess, forceUpdate = false) {
    if (app.user.locale) {
        onSuccess(app.user.locale);
    } else {
        fetchUserData(user => {
            let currentLocale = user.locale || getFallbackLocale();
            onSuccess(currentLocale);
        }, forceUpdate);
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
 * Initializes the local copy of the user's data.
 */
export function initUserData() {
    app.user = {
        name: "",
        surname: "",
        password: "",
        email: "",
        profPic: "",
        birthdate: "",
        gender: "",
        currency: "",
        locale: getFallbackLocale(), // the user is not authenticated
        revenueCategories: [],
        expenseCategories: [],
    };
    // Try to get the user's preference from Firestore (if the user is logged)
    // TODO: remove this update, this should all done when the user session is established (or restored from Firestore)
    //fetchUserLocale((locale) => changeLanguage(locale));
}

/**
 * Sets the website's language and updates the language inside user's preference.
 * @param {String} languageISO the code representing the language (ISO 639)
 */
export function changeLanguage(languageISO) {
    if (i18n.locale !== languageISO) {
        app.user.locale = languageISO;
        i18n.locale = languageISO;
        localStorage.setItem("userLocale", i18n.locale);
    }
}

/**
 * Initializes the locale for unauthenticated users.
 */
export function initLanguage() {
    let currentLanguage = app.user.locale || getFallbackLocale();
    return changeLanguage(currentLanguage);
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
 * Fetches the user's currency from cache if present, otherwise queries Firestore.
 * @param {Function} onSuccess called when data is available
 * @param {Boolean} forceUpdate force update the data available
 */
export function fetchUserCurrency(onSuccess, forceUpdate = false) {
    if (app.user.currency) {
        onSuccess(app.user.currency);
    } else {
        fetchUserData(user => onSuccess(user.currency), forceUpdate);
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

    let shouldFetchNewData = forceUpdate || !app.user.name || !app.user.surname || !app.user.email || !app.user.locale
        || !app.user.profPic || !app.user.expenseCategories.length || !app.user.revenueCategories.length;
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
        app.user.locale = (userDoc.locale && userDoc.locale.length === 2) ? userDoc.locale : app.user.locale;
        app.user.birthdate = (userDoc.birthdate && userDoc.birthdate.length > 0) ? userDoc.birthdate : app.user.birthdate;
        app.user.currency = (userDoc.currency && userDoc.currency.length > 0) ? userDoc.currency : app.user.currency;
        app.user.revenueCategories = (userDoc.revenueCategories && userDoc.revenueCategories.length > 0) ? userDoc.revenueCategories : app.user.revenueCategories;
        app.user.expenseCategories = (userDoc.expenseCategories && userDoc.expenseCategories.length > 0) ? userDoc.expenseCategories : app.user.expenseCategories;
        onSuccess(app.user);
    });
}

export const DEFAULT_CURRENCY = "EUR"

/**
 * Converts the value into the desidered currency.
 * @param {Number} value the value to be converted in [currency]
 * @param {String} currency in ["EUR", "USD"]
 */
export function convertFromEUR(value, currency) {
    switch (currency) {
        case "USD":
            return parseFloat((value * 1.09).toFixed(2));
        case "GBP":
            return parseFloat((value * 0.89).toFixed(2));
        case "EUR":
        default:
            return parseFloat(value.toFixed(2));
    }
}

/**
 * Checks wheter the same category name is already taken in the 'categoryList'.
 * @param {String} categoryName 
 * @param {Array} categoryList 
 */
export function uniqueCategory(categoryName, categoryList) {
    return categoryList.map((cat) => cat.name.toLowerCase()).includes(categoryName.toLowerCase());
}

export const currencies = [
    { iso: "EUR", name: "euro" },
    { iso: "USD", name: "united_states_dollar" },
    { iso: "GBP", name: "pound_sterling" }
];

export const locales = [
    { iso: "en", name: "English" },
    { iso: "it", name: "Italiano" },
    { iso: "es", name: "Español" },
    { iso: "de", name: "Deutsch" }
];

export const defaultCategoryIcons = ["necktie",
    "coinup",
    "bgift",
    "salary2",
    "gaming",
    "smartwatch",
    "tax"
];

export const categoryColors = [
    "#3949ab",
    "#ff9800",
    "#9575cd",
    "#00acc1",
    "#ec407a",
    "#66bb6a",
    "#fdd835"
];

export let userIncomeCategories = [
    {
        name: "Business",
        icon: defaultCategoryIcons[0],
        color: categoryColors[0],
    },
    {
        name: "Extra credit",
        icon: defaultCategoryIcons[1],
        color: categoryColors[1],
    },
    {
        name: "Gifts",
        icon: defaultCategoryIcons[2],
        color: categoryColors[2],
    },
    {
        name: "Salary",
        icon: defaultCategoryIcons[3],
        color: categoryColors[3],
    },
];


export let userExpenseCategories = [
    {
        name: "Entertainment",
        icon: defaultCategoryIcons[4],
        color: categoryColors[4],
    },
    {
        name: "Sport",
        icon: defaultCategoryIcons[5],
        color: categoryColors[5],
    },
    {
        name: "Taxes",
        icon: defaultCategoryIcons[6],
        color: categoryColors[6],
    }
];

/**
 * Converts the value into the desidered currency.
 * @param {Number} value the value to be converted in [currency]
 * @param {String} currency in ["EUR", "USD"]
 */
export function convertToEUR(value, currency) {
    switch (currency) {
        case "USD":
            return parseFloat((value * 0.92).toFixed(2));
        case "GBP":
            return parseFloat((value * 1.13).toFixed(2));
        case "EUR":
        default:
            return parseFloat(value.toFixed(2));
    }
}
/**
 * Returns the current locale used in the app.
 */
export function getCurrentLocale() {
    return app.user.locale || getFallbackLocale();
}