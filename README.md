# JSONata Exerciser

This allows you to test JSONata expressions against a JSON input structure.
Paste the JSON data into the left hand pane, and type JSONata expressions into the top right pane.
The result will appear below. 

## Running the app locally

- `npm install`
- `npm start`

The app is also available at [try.jsonata.org](http://try.jsonata.org/)

## Optional: Enabling 'Save and Share' icon

This requires a Cloudant database to store expressions

- Provision cloudant service
- create a database named `exerciser`
- Bind service to Exerciser app

The exerciser will pick up the credentials from VCAP_SERVICES, if provisioned in Cloud Foundry

This also requires Google ReCapture credentials, which are assigned to environment variables:

- RECAPTURE_SITEKEY
- RECAPTURE_SECRET

## Selecting version of JSONata

On loading, the exerciser uses the latest version of JSONata served up from [unpkg.com](https://unpkg.com/jsonata/jsonata.min.js).

It is possible to load different versions of JSONata by typing the following command into the JSONata input box and pressing return:

`J:use 1.3.1`
to load version 1.3.1 which was published to [npm](http://npmjs.com/jsonata)

## Running against a local version of JSONata

To use a local, modified, version of JSONata with the exerciser (for example, when experimenting with changes):
- Clone [JSONata](https://github.com/jsonata-js/jsonata), change into the directory and run `npm install` and `npm run prePublishOnly` to install dependencies and build it
- Run `npm link` in the same directory, then switch to the exerciser directory and run `npm link jsonata`
- In the JSONata input box type the following command to use your local version of JSONata: `J:use local`
