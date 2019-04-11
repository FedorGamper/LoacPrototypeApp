import { resolveAfter } from '../prototypeUtils';
import { connectToDevice, sendDataToDevice, scanDevices, disconnect } from '../bluetoothtest';

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


   
    /*return new Promise(resolve => {

        connectToDevice(device.bluetoothAddress, () => {
            resolve('resolved');
        });
    });*/
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

        sendDataToDevice(
            device.bluetoothAddress,
            UUIDS.service,
            UUIDS.accReq,
            "0xde, 0xad, 0xbe, 0xff",
            () => {
            resolve('resolved');
        });
    });

}