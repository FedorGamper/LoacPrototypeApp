import { logUncatched } from './utils';

const baseUrl = 'https://loacprotocol.appspot.com/api';
const httpModule = require("http");

async function request(method, endpoint, content, username, password)
{
    return new Promise((resolve, reject)=>{

        var url = baseUrl + endpoint;
        console.log(method + ": " + url);

        var authHeader = "Basic " + btoa(username + ":" + password)

        httpModule.request({
            url: url,
            method: method,
            headers: { "Content-Type": "application/json" ,
                       "Authorization": authHeader},
            content: content==null ? null : JSON.stringify(content) 
        }).then((response) => {
            try{

                if(response.statusCode < 400)
                {
                    console.log("Result of " + method + " " + url + ":" + response.statusCode);
                    console.log("Response Content: " + response.content.toString());

                    const result = response.content.toJSON();

                    console.log(JSON.stringify(result));
                    resolve(result);
                }
                else
                {
                    resolve(false);
                }

            }catch(err)
            {
                logUncatched(err);
            }
            
        }, (e) => {
            logUncatched(e);
            reject(e);
        });

    });
}

export async function loadDevices(username, password) {

    var result = await request('GET', '/permissions', null, username, password);
    return result;
};

export async function sendLogin(req, username, password) {

    var result = await request('POST', '/login', req, username, password);
    return result;
}