import {resolveAfter} from './prototypeUtils';

export async function loadDevices(){

    let devices = [
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

export async function sendLogin(req, password){

    await resolveAfter(500);
    return "cecece";
}