import {loac} from '../loacBinding';
import {sendLogin} from '../apiBindings';

let subject = null;
let certificate = null;

export function getSubject(){

    return subject;
};

export function getCertificate(){
   return certificate;
}

export async function login(username, password){

    console.log("Start login username=" + username);

    let subject = new loac.Subject();
    let req = subject.generateOnboardingRequest(username);

    certificate = await sendLogin(req, password);

    console.log("End Login: Certificate=" + certificate);
    return true;
}