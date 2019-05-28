FROM node:11.3.0

ARG NODE_ENV=development
ARG NODE_ENV=${NODE_ENV}

WORKDIR /usr/app

COPY package* ./
RUN npm install

COPY . .

CMD [ "npm", "start:prod" ]
