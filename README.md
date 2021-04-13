# JSONata Exerciser

This allows you to test JSONata expressions against a JSON input structure.
Paste the JSON data into the left hand pane, and type JSONata expressions into the top right pane.
The result will appear below.

## Running the app locally

- `npm install`
- `npm start`

The app is also available at [try.jsonata.org](http://try.jsonata.org/)

## Running the app on docker

1. Build docker image

> `docker build -t jsonata-exerciser:v1 -f Dockerfile .`

2. Run docker image

> `docker run -P jsonata-exerciser:v1`

3. Open another terminal and check to which port docker port `3000` is bound to :

> `docker ps`

- Look at `PORTS` column of output and its content should be similar to : `0.0.0.0:32770->3000/tcp`.
- It means `node js` server will be available at `0.0.0.0:32770`