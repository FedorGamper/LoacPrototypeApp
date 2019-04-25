import {resolveAfter} from './prototypeUtils';
import { loac } from './loacBinding';

// These are just some mock values
var ia = new loac.IdentityAuthority(24*3600*7, "a0a38dd2164889c316c2ac5f15ac0511ea63b03902b83ff3");
var pa = new loac.PermissionAuthority("0b010133adc585e9c9f43f59a8f05fa74cfd1961663757b1");
var mockUsername = null;

export async function loadDevices(){

    let now = loac.utils.dateToUnixTime(new Date());
    
    let devices = []
    
    if(mockUsername == 'Batman')
    {
        devices = [
            {
                name: "Fedors's Raspberry",
                description: "Von Fedor",
                imageUrl: "https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F9%2F97%2FRaspberry_Pi_3_B%252B_%252839906369025%2529.png%2F1200px-Raspberry_Pi_3_B%252B_%252839906369025%2529.png&f=1",
                
                delegatedBy: null,
    
                buttons: [
                    {
                        "text": "Small Coffee",
                        "command": "brew small coffee"
                    },
                    {
                        "text": "Large Coffee",
                        "command": "brew large coffee"
                    }
                ],
    
                loac:{
                    resourceName: "fedorspi",
                    tokens: [pa.issueToken(mockUsername, true, "fedorspi", now-1000, now+1000)],
                    certificates: []
                }
            }
        ]
    }
    
    await resolveAfter(500);

    return devices;
};

export async function sendLogin(req, username, password){

    try
    {
        console.log("Start mock login api");
        console.log("Mock PA public: " + pa.pk);
        console.log("Mock IA public: " + ia.pk);

        if(password != 'pass')
            return false

        mockUsername = username;

        var cert = ia.handleOnboaradingRequest(req, username);

        console.log("Certificate generated");
        return cert;
    }
    catch(err) {
        console.log("Error in login:");
        console.log(err.message);
        return false;
    }
    
}