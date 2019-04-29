import {loac} from '../loacSingleton';
import {sendLogin, loadDevices} from './ApiController';
import { logUncatched } from '../utils';

/**
 * This module contains all functions concerning the
 * login functionality of the app.
 */


const appSettings = require("application-settings");

/**
 * Returns the if the user is has stored all needed settings in the app
 */
export async function isLogedIn(){
 
    return appSettings.hasKey("secret") && appSettings.hasKey("certificate") && appSettings.hasKey("username");
}

/**
 * Performs a login:
 * 1) Creates the secret key and signs a singing request
 * 2) Sends the signing request to the server
 * 3) If ok: Stores the received certificate, otherwise returns that the login is invalid.
 * @param {String} username 
 * @param {String} password 
 */
export async function login(username, password){

    try{
        console.log("Login username=" + username);

        let subject = new loac.Subject();

        let req = subject.generateOnboardingRequest(username);

        console.log("Signing request generated");

        let certificate = await sendLogin(req, username, password)

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
    catch(err)
    {
        logUncatched(err);
        return false;
    }
}

/**
 * Loads the deviceObjects from the server
 */
export async function loadDevicesFromServer(){

    var username = appSettings.getString('username');
    var password = appSettings.getString('password');

    var result = loadDevices(username, password);

    console.log("Devices loaded:");
    console.log(result);

    return result;
}

/**
 * Deletes all certificates, secrets and passwords.
 */
export async function logout(){

    appSettings.clear();
    return true;
}