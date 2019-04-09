import {resolveAfter} from './prototypeUtils';

export async function loadDevices(){

    let devices = [
        {
            name: "SuperCoffee 2000",
        },
        {
            name: "Espresso Maker",
        }
    ]

    await resolveAfter(500);

    return devices;
};

export async function sendLogin(req, password){

    await resolveAfter(500);
    return "cecece";
}