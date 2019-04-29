import { connectToDevice, sendDataToDevice, scanDevices, disconnect } from './BluetoothController';
import { loac } from '../loacSingleton';
/**
 * This module contains all functions concerning the DeviceDetailPage.
 */

const appSettings = require("application-settings");
const UUIDS = {
    service: "4c6f6163-5072-6f74-6f63-6f6c53657230",
    accReq: "4c6f6163-5072-6f74-6f63-6f6c43686130",
    time: "4c6f6163-5072-6f74-6f63-6f6c43686131",
    name: "4c6f6163-5072-6f74-6f63-6f6c43686132",
    state: "4c6f6163-5072-6f74-6f63-6f6c43686133"
}

/**
 * Starts searching for nearby Bluetooth devices which advertises
 * the prototype service uuid.
 */
export async function searchAvailableDevices(){

    return new Promise(resolve => {

        try {

            scanDevices(null,
                // The discovered Callback
                peripheral => {

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

/**
 * Searches for a specific device and connects to it if found.
 * The returned promise is resolved with and object
 * { success: true, uuid: deviceuuid} if the device is found.
 * If no device is found the success value in the returned object is false.
 * 
 * @param {deviceObject} device 
 */
export async function searchAndConnect(device) {

    return new Promise(resolve => {

        let deviceFoundAndConnected = false;

        scanDevices(UUIDS.service,
            // The discovered Callback
            peripheral => {
                console.log("discovered device name=" + peripheral.name);

                if (peripheral.name = device.loac.resourceName) {

                    console.log("We found the device with name= " + peripheral.name + " the uuid is: " + peripheral.UUID);
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

/**
 * Disconnects from the device with the bluetooth given uuid.
 * If the device was not connected nothing happens.
 * @param {uuidString} uuid 
 */
export async function disconnectDevice(uuid) {

    return new Promise(resolve => {

        disconnect(uuid, () => {

            resolve('resolved');
        });
    });
}

/**
 * Generates an access request for a device and returns the serialized message.
 */
function createAccessRequestMessage(device, command) {

    const secret = appSettings.getString("secret");
    const certificate = appSettings.getString("certificate");

    console.log("Secret: " + secret);

    var subject = new loac.Subject(secret);

    const certificates = device.loac.certificates.concat(certificate);
    const tokens = device.loac.tokens;
    var accessRequest = subject.createAccessRequest(device.loac.resourceName, command, tokens, certificates);
    console.log("Created access request: " + JSON.stringify(accessRequest));

    var message = accessRequest.serialize();
    console.log("Message: len= " + message.length + " : " + message.toString('hex'));

    return message;
}

/**
 * This is used for debugging. Creates a access request for a device and tests if
 * it is valid but does not send it.
 * @param {deviceObject} device 
 * @param {String} command 
 */
export async function debugAccessRequest(device, command) {
    try {

        const message = createAccessRequestMessage(device, command);

        // DEBUG
        var resource = new loac.Resource(
            'fedorspi',
            ["494c131df69b29b9a1aff65ea9958ac1ed1d7281d48aab0b"],
            ["1fb1b56b26131b191457273ff9566ee7d87c167365c7d961"],
            10);

        resource.checkAccessRequest(message, () => { });
        console.log("valid request all ok");
    }
    catch (err) {
        console.log("The access request is invalid!!! " + JSON.stringify(err));
    }

}

/**
 * Creates an access request and sends it to the Bluetooth device with the given uuid.
 * This function expects that the Bluetooth peripherial is already connected.
 * @param {deviceObject} device 
 * @param {uuidString} deviceUuid 
 * @param {string} command 
 */
export async function access(device, deviceUuid, command) {

    return new Promise(resolve => {

        try {

            const message = createAccessRequestMessage(device, command);

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