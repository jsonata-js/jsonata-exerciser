# JSONata Exerciser

This allows you to test JSONata expressions against a JSON input structure.
Paste the JSON data into the left hand pane, and type JSONata expressions into the top right pane.
The result will appear below. 

## Run the app locally

- npm install
- npm start

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

On loading, the exerciser uses the latest version of JSONata served up from
`https://unpkg.com/jsonata/jsonata.min.js`

It is possible to load different versions of JSONata but typing the following command into the JSONata input box:

`J:use 1.3.1` followed by newline
to load version 1.3.1

It is also possible to load a development branch from GitHub using (e.g.):
`J:branch 1.4` followed by newline 
