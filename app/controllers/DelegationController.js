import { loac } from '../loacBinding';
import { copyObject } from '../utils';
var msgpack = require("msgpack-lite");

const appSettings = require("application-settings");

export async function unpackReceivedAccessRights(encodedObj){

    const myUsername = appSettings.getString("username");
    var device = null;
    try{
        var buff = new Buffer(encodedObj, 'base64');
        device = msgpack.decode(buff);
    }
    catch(err){
        console.log("Uncatched error" + err.message);
        return {
            success: false,
            message: "Invalid token."
        };
    }

    console.log(JSON.stringify(device));
    console.log("Issued for: " + device.issuedFor + " myUsername: " + myUsername);
    if(device.issuedFor != myUsername)
    {
        return{
            success: false,
            message: "This tokens is not intended for you."
        }
    }
    else
    {
        return{
            success: true,
            device: device
        }
    }
}

export async function delegateAccessRights(device, recieverUsername){

        try{
            const resourceName = device.loac.resourceName;
            const priorTokens = device.loac.tokens;

            const lastToken = priorTokens[priorTokens.length - 1]

            console.log("Delegating "+ resourceName + " to " + recieverUsername);

            const secret = appSettings.getString("secret");
            const username = appSettings.getString("username");
            const certificate = appSettings.getString("certificate");

            var subject = new loac.Subject(secret);

            const newToken = subject.issueDelegatedToken(recieverUsername, true, resourceName, lastToken.validityStart, lastToken.validityEnd);

            console.log("New token: "+ JSON.stringify(newToken));


            const copy = copyObject(device);
            copy.delegatedBy = username;
            copy.issuedFor = recieverUsername;
            copy.loac.tokens.push(newToken);
            copy.loac.certificates.push(certificate);

            var buffer = msgpack.encode(copy);
            return buffer.toString('base64');
        }
        catch(err)
        {
            console.log("Uncatched error" + err.message);
        }
}