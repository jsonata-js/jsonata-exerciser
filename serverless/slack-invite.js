async function main(params) {
    const google_url = 'https://www.google.com/recaptcha/api/siteverify';

    const body = new URLSearchParams();
    body.append('secret', process.env.CAPTCHA_SECRET);
    body.append('response', params.recaptcha);

    try {
        const response = await fetch(google_url, {
            method: 'post',
            body: body,
        });
        const recap_body = await response.json();
        if (recap_body.success === true) {
            // not a robot! - register with slack

            const email = params.email;
            const token = process.env.SLACK_TOKEN || 'default';
            const slack_url = `https://slack.com/api/users.admin.invite?token=${token}&email=${email}`;
            const response = await fetch(slack_url);
            if (response.ok) {
                return {
                    statusCode: 201,
                    body: {}
                };
            } else {
                return {
                    statusCode: response.status,
                    body: {message: await response.text()}
                }
            }
        } else {
            // failed the reCaptcha challenge
            return { 
                statusCode: 400, 
                body: {message: 'Failed the robot challenge!', 
                recap: recap_body}
            };
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
