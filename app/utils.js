const application = require("tns-core-modules/application");

export function isAndroid(){

    return application.android;
}

export function copyObject(obj){
    return JSON.parse(JSON.stringify(obj))
}

export function logUncatched(err){
    console.log("Uncatched error: " + err.message);
}