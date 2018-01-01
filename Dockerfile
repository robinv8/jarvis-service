FROM node:8-alpine as builder

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app

EXPOSE 80

ENTRYPOINT ["npm", "build"]