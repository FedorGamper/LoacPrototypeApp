import {loac} from '../loacBinding';
import {sendLogin, loadDevices} from '../apiBindings';

const appSettings = require("application-settings");


let subject = null;
let certificate = null;

export function getSubject(){

    return subject;
};

export function getCertificate(){
   return certificate;
}

export async function isLogedIn(){
 
    return appSettings.hasKey("secret") && appSettings.hasKey("certificate") && appSettings.hasKey("username");
}

export async function login(username, password){

    console.log("Login username=" + username);

    let subject = new loac.Subject();

    let req = subject.generateOnboardingRequest(username);

    console.log("Signing request generated");

    certificate = await sendLogin(req, username, password)

    if(certificate)
    {
        console.log("Certificate: " + certificate);
        console.log("Secret: " + subject.sk);

        appSettings.setString("secret", subject.sk);
        appSettings.setString("certificate", certificate);
        appSettings.setString("username", username);
        appSettings.setString("password", password);

        return true;
    }

    return false;
}

export async function loadDevicesFromServer(){

    var username = appSettings.getString('username');
    var password = appSettings.getString('password');

    var result = loadDevices(username, password);

    console.log("Devices loaded:");
    console.log(result);

    return result;
}

export async function logout(){

    appSettings.clear();
    return true;
}