FROM node:10

EXPOSE 3000

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

WORKDIR /home/node/app

USER node

COPY package.json ./

RUN npm install

RUN npm audit fix

COPY . .

CMD [ "npm", "start" ]