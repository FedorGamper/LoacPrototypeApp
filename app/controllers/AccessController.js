import { connectToDevice, sendDataToDevice, scanDevices, disconnect } from '../bluetoothtest';
import { loac } from '../loacBinding';
import { isAndroid } from '../utils';

const appSettings = require("application-settings");

const UUIDS = {
    service: "4c6f6163-5072-6f74-6f63-6f6c53657230",
    accReq: "4c6f6163-5072-6f74-6f63-6f6c43686130",
    time: "4c6f6163-5072-6f74-6f63-6f6c43686131",
    name: "4c6f6163-5072-6f74-6f63-6f6c43686132",
    state: "4c6f6163-5072-6f74-6f63-6f6c43686133"
}

export async function searchAviableDevices() {

    return new Promise(resolve => {


        try {


            scanDevices(null,
                // The discovered Callback
                peripheral => {

                    
                    /*
                    { "UUID": "5DD19D5C-ADD3-BA55-ADAC-CA07ADA757A9", "name": "[TV] Samsung 6 Series (43)", "RSSI": -93, "state": "disconnected", "manufacturerId": 117, "manufacturerData": { } }
                    */
                    console.log("Device found with name: " + peripheral.name);

                },
                // The oncomplete callback
                () => {

                    resolve(true);
                }
            );
        }
        catch (err) {
            console.log("Uncatched errro: " + err.message);
            resolve(false)
        }

    });

}

export async function searchAndConnect(device) {

    return new Promise(resolve => {

        let deviceFoundAndConnected = false;

        scanDevices(UUIDS.service,
            // The discovered Callback
            peripheral => {
                console.log("discovered device name=" + peripheral.name);

                if (peripheral.name = device.loac.resourceName) {

                    console.log("We found the device with name= " + peripheral.name +" the uuid is: " + peripheral.UUID);
                    console.log(peripheral);

                    connectToDevice(peripheral.UUID, () => {
                        deviceFoundAndConnected = true;

                        resolve({
                            success: true,
                            uuid: peripheral.UUID
                        });
                    });
                }
            },
            // The oncomplete callback
            () => {

                console.log("onCompleteCallback deviceFoundAndConnected=" + deviceFoundAndConnected);
                if (!deviceFoundAndConnected)
                    resolve({
                        success: false
                    });
            }
        );
    });
}

export async function disconnectDevice(uuid) {

    return new Promise(resolve => {

        disconnect(uuid, () => {

            resolve('resolved');
        });
    });



}

export async function access(device, deviceUuid, command) {

    return new Promise(resolve => {

        try {

            const secret = appSettings.getString("secret");
            const certificate = appSettings.getString("certificate");

            console.log("Secret: " + secret);
            
            var subject = new loac.Subject(secret);

            const certificates = device.loac.certificates.concat(certificate);
            const tokens = device.loac.tokens;
            var accessRequest = subject.createAccessRequest(device.loac.resourceName, command, tokens, certificates);

            console.log("Created access request: "+ JSON.stringify(accessRequest));

            var message = accessRequest.serialize();
            console.log("Message: len= " + message.length + " : " + message.toString('hex'));
            

            sendDataToDevice(
                deviceUuid,
                UUIDS.service,
                UUIDS.accReq,
                message,
                () => { resolve(true); },
                () => { resolve(false); }
            );
        }
        catch (err) {
            console.log("Error in access: " + err.message)
            resolve(false);
        }

    });

}