import { resolveAfter } from '../prototypeUtils';
import { connectToDevice, sendDataToDevice, scanDevices, disconnect } from '../bluetoothtest';
import { loac } from '../loacBinding';

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

        scanDevices(UUIDS.service, peripheral=>{
            
            console.log("OnDiscoveredCallback peripheral.UUID=" + peripheral.UUID);
            console.log("We are looking for " + device.bluetoothAddress);

            if(peripheral.UUID == device.bluetoothAddress){
                console.log("We found the device with UUID = " + peripheral.UUID);
                
                connectToDevice(peripheral.UUID, () => {
                    resolve('resolved');
                });
            }
        });
    });
}

export async function disconnectDevice(device){

    console.log("disconnectDevice");

    return new Promise(resolve =>{

        disconnect(device.bluetoothAddress, ()=>{

            resolve('resolved');
        });
    });

   

}

export async function access(device) {

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
                device.bluetoothAddress,
                UUIDS.service,
                UUIDS.accReq,
                message,
                () => {
                resolve('resolved');
            });
        }
        catch(err)
        {
            console.log("Error in access: " + err.message)
        }
        
    });

}