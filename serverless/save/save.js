const shortid = require('shortid');

/**
 *
 * main() will be run when you invoke this action
 *
 * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
 *
 * @return The output of this action, which must be a JSON object.
 *
 */
async function main(params) {
    const google_url = 'https://www.google.com/recaptcha/api/siteverify';

    // get the client's ip address
    // const ip = params['__ow_headers']['x-real-ip'];

    const body = new URLSearchParams();
    body.append('secret', process.env.CAPTCHA_SECRET);
    body.append('response', params.recaptcha);
    // body.append('remoteip', ip);  -- add this when the Code Ending supports it

    try {
        const response = await fetch(google_url, {
            method: 'post',
            body: body,
        });
        const recap_body = await response.json();
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
            const cloudant_url = `https://${process.env.CLOUDANT_WRITE_HOST}/exerciser/${doc._id}`;
            const auth = Buffer.from(process.env.CLOUDANT_WRITE_USERNAME + ':' + process.env.CLOUDANT_WRITE_PASSWORD, "binary").toString("base64");
            var headers = {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/json', 
            };
            const response = await fetch(cloudant_url, {
                method: 'put',
                headers: headers,
                body: JSON.stringify(doc)
            });
            if (response.ok === true) {
                const cloudant_body = await response.json();
                return {
                    statusCode: 201,
                    headers: {
                      'Content-Type': 'application/json', 
                    },
                    body: {id: cloudant_body.id}
                };
            } else {
                return {
                    statusCode: response.status,
                    body: {error: await response.text()}
                }
            }
        } else {
            // failed the reCaptcha challenge
            return { statusCode: 400, body: 'Failed the robot challenge!' };
        }
    } catch (error) {
        return {
            statusCode: 500,
            headers: { 
              'Content-Type': 'application/json', 
            },
            body: {'error': error.message }
          };
    }
}

global.main = main;