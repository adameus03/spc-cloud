FROM node:20-alpine3.17

WORKDIR /home/mundus/base/nodejs/spc-cloud

COPY package*.json ./

RUN npm install
# RUN npm ci --omit=dev

COPY . .

RUN mkdir ./usrFiles

EXPOSE 8000

CMD [ "npm", "start" ]
