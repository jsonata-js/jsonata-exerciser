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
                return reject({ statusCode: 500, body: {message: err.message} });
            } else {
                const recap_body = JSON.parse(body);
                if (recap_body.success === true) {
                    // not a robot! - register with slack

                    const email = params.email;
                    const token = params['SLACK_TOKEN'] || 'default';
                    const url = 'https://slack.com/api/users.admin.invite';
                    request({
                        url: url,
                        method: 'GET',
                        qs: {
                            token: token,
                            email: email
                        }
                    }, function (error, response, body) {
                        if (error) {
                            return reject({ statusCode: 500, body: {message: error.message} });
                        } else {
                            var json = JSON.parse(body);
                            if(json.ok === true) {
                                return resolve({statusCode: 201, body: {}});
                            } else {
                                return reject({statusCode: 500, body: {message: json.error} });
                            }
                        }
                    });
                } else {
                    // failed the reCaptcha challenge
                    return reject({ statusCode: 400, body: {message: 'Failed the robot challenge!', recap: recap_body} });
                }
            }
        })
    })
}

global.main = main;