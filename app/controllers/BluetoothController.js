/**
 * This module provides the low-lever Bluetooth functionalities
 */

var bluetooth = require("nativescript-bluetooth");
const SEARCH_TIME_SECONDS = 4

/**
 * Scans for available Bluetooth devices
 * 
 * @param {*} serviceUUID The uuid of the Bluetooth Low Energy Service
 * @param {*} onDiscoveredCallback A callback called with the when a device is found.
 * @param {*} onCompleteCallback  A callback called when the search finished.
 */
export function scanDevices(serviceUUID, onDiscoveredCallback, onCompleteCallback) {

    console.log("Start scanning for devices with service uuid=" + serviceUUID);

    var discoveredPeripherals = [];

    var serviceUUIDs = serviceUUID == null ? [] : [serviceUUID]

    bluetooth.startScanning({
        serviceUUIDs: serviceUUIDs,
        seconds: SEARCH_TIME_SECONDS,
        onDiscovered: function (peripheral) {
            console.log("Periperhal found with UUID: " + peripheral.UUID);
            discoveredPeripherals.push(peripheral);
            onDiscoveredCallback(peripheral);
        },
        skipPermissionCheck: false,
    }).then(function () {
        console.log("scanning complete");

        if(onCompleteCallback)
            onCompleteCallback(discoveredPeripherals);

    }, function (err) {
        console.log("error while scanning: " + err);
    });
}

/**
 * Disconnects from a Blueooth Device
 * @param {*} uuid The uuid of the device
 * @param {*} onDisconnected A callback called when the device is disconnected
 */
export function disconnect(uuid, onDisconnected){
    
    console.log("Start disconnecting from " + uuid);
    bluetooth.disconnect({
        UUID: uuid
      }).then(function() {
        console.log("disconnected successfully");
        onDisconnected();
      }, function (err) {
        // in this case you're probably best off treating this as a disconnected peripheral though
        console.log("disconnection error: " + err);
      });
}

/**
 * Connects to a Device
 * @param {*} uuid The uuid of the peripherial
 * @param {*} successCallback A callback called when the device is connected
 */
export function connectToDevice(uuid, successCallback){

    console.log("Start connecting to " + uuid)

    bluetooth.connect({

        UUID: uuid,
        onConnected: function (peripheral) {
            console.log("Periperhal connected with UUID: " + peripheral.UUID);
            console.log(peripheral);

            successCallback();

        },
        onDisconnected: function (peripheral) {
            console.log("Periperhal disconnected with UUID: " + peripheral.UUID);
        }
    });

}

/**
 * Sends a message to a bluetooth device
 * @param {String} uuid The uuid of the device.
 * @param {String} serviceUUID The uuid of the BLE service.
 * @param {String} characteristicUUID The uuid of the charactersistics.
 * @param {Buffer} message The message as Buffer.
 * @param {Callback} successCallback A callback called on success.
 * @param {Callback} errorCallback A callback called when a error occurs.
 */
export function sendDataToDevice(uuid, serviceUUID, characteristicUUID, message, successCallback, errorCallback){

    console.log("Start sendDataToDevice ");
    console.log("Service UUID: " + serviceUUID);
    console.log("characteristicUUID: " + characteristicUUID);
    console.log("peripheralUUID:  " + uuid);
    console.log("message length without padding:  " + message.length);

    // Very simple padding
    message = Buffer.concat([message, Buffer.from('ff', 'hex')]);

    console.log("message content: " + message.toString('hex'));

    bluetooth.write({
        serviceUUID: serviceUUID,
        characteristicUUID: characteristicUUID,
        peripheralUUID: uuid,
        value: message
    }).then(
        () => {
            console.log("WRITTEN:" + message);
            successCallback();
        }
    , function (err) {
        console.log("write error: " + err);

        if(errorCallback)
            errorCallback(err);
    });
}

export function readDataFromDevice(uuid, readCallback){

    console.log("Start reading data");

    bluetooth.read({
        serviceUUID: serviceUUID,
        characteristicUUID: characteristicUUID,
        peripheralUUID: uuid
    }).then(
        (result) => {
            var data = new Uint8Array(result.value);
            console.log("READ: len=" + data.length + ": " + data);
            readCallback(data);
        }
    , function (err) {
        console.log("read error: " + err);
        });
}