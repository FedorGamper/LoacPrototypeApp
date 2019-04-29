import { logUncatched } from '../utils';

/**
 * This module is responsible for making the HTTPS Requests to the remote api
 */

const baseUrl = 'https://loacprotocol.appspot.com/api';
const httpModule = require("http");

/**
 * Performs a http(s) request and deserialize the answer.
 * @param {String} method 'GET' or 'POST'
 * @param {String} endpoint The endpoint with leading slash. Example: '/login'
 * @param {String} content The payload of the request as object or null
 * @param {String} username The username
 * @param {String} password The password
 */
async function request(method, endpoint, content, username, password)
{
    return new Promise((resolve, reject)=>{

        var url = baseUrl + endpoint;
        console.log(method + ": " + url);

        // HTTP basic auth header
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

/**
 * Loads all deviceObjects from the server
 * @param {String} username 
 * @param {String} password 
 */
export async function loadDevices(username, password) {

    var result = await request('GET', '/permissions', null, username, password);
    return result;
};

/**
 * The login/certificate singing endpoint
 * @param {CertificateSingingRequest} req The singing request 
 * @param {*} username
 * @param {*} password 
 */
export async function sendLogin(req, username, password) {

    var result = await request('POST', '/login', req, username, password);
    return result;
}