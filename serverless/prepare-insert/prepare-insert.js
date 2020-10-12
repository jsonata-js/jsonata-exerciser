const shortid = require('shortid');
const request = require("request");

/**
 *
 * main() will be run when you invoke this action
 *
 * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
 *
 * @return The output of this action, which must be a JSON object.
 *
 */
function main(params) {
    const url = 'https://www.google.com/recaptcha/api/siteverify';

    // get the client's ip address
    const ip = params['__ow_headers']['x-real-ip'];

    // build a POST request to verify the captcha
    var r = {
        uri: 'https://www.google.com/recaptcha/api/siteverify',
        method: 'post',
        form: {
            secret: params['CAPTCHA_SECRET'],
            response: params.recaptcha,
            remoteip: ip
        }
    };

    // return a Promise because we're about to do an asynchronous thing
    return new Promise((resolve, reject) => {

        // make HTTP request to verify the captcha
        request(r, (err, response, body) => {
            if (err) {
                return reject({ statusCode: 500, msg: err.message });
            } else {
                const recap_body = JSON.parse(body);
                if (recap_body.success === true) {
                    // not a robot! - put it in cloudant
                    const now = new Date();
                    const doc = {
                        _id: shortid.generate(),
                        timestamp: now.toISOString(),
                        input: params.input,
                        jsonata: params.jsonata,
                        bindings: params.bindings,
                        externalLibs: params.externalLibs
                    };
                    if (params.result) {
                        doc.result = params.result;
                    }
                    if (params.error) {
                        doc.error = params.error;
                    }
                    return resolve({doc: doc});
                } else {
                    // failed the reCaptcha challenge
                    return reject({ statusCode: 400, msg: 'Failed the robot challenge!' });
                }
            }
        })
    })
}

global.main = main;