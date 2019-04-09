import { login } from "./controllers/LoginController";

function resolveAfterHalfSecond() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('resolved');
      }, 500);
    });
  }

export async function loadDevices(){

    let devices = [
        {
            name: "SuperCoffee 2000",
        },
        {
            name: "Espresso Maker",
        }
    ]

    await resolveAfterHalfSecond();

    return devices;
};

export async function sendLogin(req, password){

    await resolveAfterHalfSecond();
    return "cecece";
}