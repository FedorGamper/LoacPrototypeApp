var bluetooth = require("nativescript-bluetooth");

export function scanDevices(serviceUUID, onDiscoveredCallback, onCompleteCallback) {

    console.log("Start scanning for devices with service uuid=" + serviceUUID);

    var discoveredPeripherals = [];

    var serviceUUIDs = serviceUUID == null ? [] : [serviceUUID]

    bluetooth.startScanning({
        serviceUUIDs: serviceUUIDs,
        seconds: 4,
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

export function sendDataToDevice(uuid, serviceUUID, characteristicUUID, message, successCallback, errorCallback){

    console.log("Start sendDataToDevice ");
    console.log("Service UUID: " + serviceUUID);
    console.log("characteristicUUID: " + characteristicUUID);
    console.log("peripheralUUID:  " + uuid);
    console.log("message length without padding:  " + message.length);

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