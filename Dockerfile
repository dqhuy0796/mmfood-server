FROM node:16-alpine

WORKDIR /backend/nodejs/

COPY package*.json ./

RUN npm install

RUN npm install -g @babel/core @babel/cli

COPY . .

RUN npm run build

CMD [ "npm" , "start" ]