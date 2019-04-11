import { resolveAfter } from '../prototypeUtils';
import { connectToDevice, sendDataToDevice, scanDevices, disconnect } from '../bluetoothtest';
import { loac } from '../loacBinding';
import { isAndroid } from '../utils';

const appSettings = require("application-settings");

const UUIDS = {
    service: "4c6f6163-5072-6f74-6f63-6f6c53657230",
    accReq:  "4c6f6163-5072-6f74-6f63-6f6c43686130",
    time:    "4c6f6163-5072-6f74-6f63-6f6c43686131",
    name:    "4c6f6163-5072-6f74-6f63-6f6c43686132",
    state:   "4c6f6163-5072-6f74-6f63-6f6c43686133"
}

export async function searchAndConnect(device) {

    return new Promise(resolve =>{

        let bluetoothAddress = isAndroid() ? device.androidAddress : device.iOsAddress;
        let deviceFoundAndConnected = false;

        scanDevices(UUIDS.service,
            // The discovered Callback
            peripheral=>{
            console.log("OnDiscoveredCallback peripheral.UUID=" + peripheral.UUID);

            if(peripheral.UUID == bluetoothAddress){

                console.log("We found the device with UUID = " + peripheral.UUID);
                console.log(peripheral);

                connectToDevice(peripheral.UUID, () => {
                    deviceFoundAndConnected = true;
                    resolve(true);
                });
            }
            },
            // The oncomplete callback
            ()=>{

                console.log("onCompleteCallback deviceFoundAndConnected=" + deviceFoundAndConnected);
                if(! deviceFoundAndConnected)
                    resolve(false);
            }
        );
    });
}

export async function disconnectDevice(device){

    let bluetoothAddress = isAndroid() ? device.androidAddress : device.iOsAddress;

    console.log("disconnectDevice");

    return new Promise(resolve =>{

        disconnect(bluetoothAddress, ()=>{

            resolve('resolved');
        });
    });

   

}

export async function access(device) {    

    let bluetoothAddress = isAndroid() ? device.androidAddress : device.iOsAddress;

    return new Promise(resolve => {

        try{

            const secret = appSettings.getString("secret");
            const certificate = appSettings.getString("certificate");
            const username = appSettings.getString('username');

            console.log("Secret: " + secret);


            var subject = new loac.Subject(secret);
            const token = device.loac.token;
            var accessRequest = subject.createAccessRequest(username, 'open', [token], [certificate]);

            var message = accessRequest.serialize();
            console.log("Message: len= " + message.length + " : " + message.toString('hex'));

            sendDataToDevice(
                bluetoothAddress,
                UUIDS.service,
                UUIDS.accReq,
                message,
                () => {resolve(true);},
                () => {resolve(false);}
            );
        }
        catch(err)
        {
            console.log("Error in access: " + err.message)
            resolve(false);
        }
        
    });

}