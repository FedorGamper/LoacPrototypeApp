const application = require("tns-core-modules/application");

export function isAndroid(){

    return application.android;
}