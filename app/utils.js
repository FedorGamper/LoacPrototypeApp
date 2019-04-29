const application = require("tns-core-modules/application");

/**
 * Returns true if the current platform is android.
 */
export function isAndroid(){

    return application.android;
}

/**
 * Clones a object and returns the copy
 * @param {*} obj 
 */
export function copyObject(obj){
    return JSON.parse(JSON.stringify(obj))
}

/**
 * Loggs an error and throws it again.
 * @param {*} err 
 */
export function logUncatched(err){
    console.log("Uncatched error: " + err.message);
    throw err;
}