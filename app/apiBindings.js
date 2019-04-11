import {resolveAfter} from './prototypeUtils';
import { loac } from './loacBinding';

// These are just some mock values
var ia = new loac.IdentityAuthority(24*3600*7, "a0a38dd2164889c316c2ac5f15ac0511ea63b03902b83ff3");
var pa = new loac.PermissionAuthority("0b010133adc585e9c9f43f59a8f05fa74cfd1961663757b1");

export async function loadDevices(){

    let now = loac.utils.dateToUnixTime(new Date());
    
    let devices = [
        {
            name: "Raspberry",
            description: "Von Fedor",
            imageUrl: "https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F9%2F97%2FRaspberry_Pi_3_B%252B_%252839906369025%2529.png%2F1200px-Raspberry_Pi_3_B%252B_%252839906369025%2529.png&f=1",
            bluetoothAddress: "76D06FB6-B95F-406B-5B40-2FF801EB3941",
            loac:{
                resourceName: "fedorspi",
                token: pa.issueToken('user', true, "fedorspi", now-1000, now+1000)
            }
        },
        {
            name: "Raspberry",
            description: "Von Gian-Luca",
            imageUrl: "https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F9%2F97%2FRaspberry_Pi_3_B%252B_%252839906369025%2529.png%2F1200px-Raspberry_Pi_3_B%252B_%252839906369025%2529.png&f=1",
            bluetoothAddress: "3E7F3A25-B739-6835-70AB-6312FE52D1E3",
            loac:{
                resourceName: "gianlucaspi",
                token: pa.issueToken('user', true, "gianlucaspi", now-1000, now+1000)
            }
        },
        {
            name: "SuperCoffee 2000",
            description: "Very noisy",
            imageUrl: "https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Fimages-na.ssl-images-amazon.com%2Fimages%2FI%2F51fSE9-U2-L._AC_UL160_SR152%2C160_.jpg&f=1",
            bluetoothAddress: "foobar",
            loac:{
                certificates: [],
                tokens: ['deadbeef']
            }
        },
        {
            name: "Espresso Maker",
            description: "Makes the best espresso",
            imageUrl: "https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.hyJ1NSgu7H0RiLeu8hVt_AAAAA%26amp%3Bpid%3DApi&f=1",
            bluetoothAddress: "barfoo",
            loac:{
                certificates: ['aabbee'],
                tokens: ['001122', 'deadbeef']
            }
        }
    ]

    await resolveAfter(500);

    return devices;
};

export async function sendLogin(req, username, password){

    try
    {
        console.log("Start mock login api");
        console.log("Mock PA public: " + pa.pk);
        console.log("Mock IA public: " + ia.pk);

        if(username != 'user')
            return false

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