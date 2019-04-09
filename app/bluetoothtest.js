var bluetooth = require("nativescript-bluetooth");

const serviceUUID = "ffffffff-ffff-ffff-ffff-fffffffffff0"
const characteristicUUID = "ffffffff-ffff-ffff-ffff-fffffffffff1"
//const peripheralUUID     = 'D30E361A-6052-FF91-5BB3-DA7631F1DFD8';

export function scanDevices(onDiscoveredCallback) {

    console.log("Start scanning for devices with service uuid=" + serviceUUID);

    bluetooth.startScanning({
        serviceUUIDs: [serviceUUID],
        seconds: 4,
        onDiscovered: function (peripheral) {
            console.log("Periperhal found with UUID: " + peripheral.UUID);
            onDiscoveredCallback(peripheral);
        },
        skipPermissionCheck: false,
    }).then(function () {
        console.log("scanning complete");
    }, function (err) {
        console.log("error while scanning: " + err);
    });


}

export function connectToDevice(uuid, successCallback){

    console.log("Start connecting")

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

export function sendDataToDevice(uuid, message){

    console.log("Start send data to device");

    bluetooth.write({
        serviceUUID: serviceUUID,
        characteristicUUID: characteristicUUID,
        peripheralUUID: uuid,
        value: message
    }).then(
        () => {
            console.log("WRITTEN:" + message);
        }
    , function (err) {
        console.log("write error: " + err);
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