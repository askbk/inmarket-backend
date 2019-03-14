FROM node:latest

ARG NODE_ENV=developent
ARG NODE_ENV=${NODE_ENV}

WORKDIR /usr/app

COPY package*.json ./
RUN npm install

COPY . .

CMD [ "npm", "start:prod" ]
