FROM node:latest

ADD . /server
WORKDIR /server

RUN npm install
CMD ["npm", "start"]
