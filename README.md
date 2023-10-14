# spc-cloud
## 14.10.2023 manual

# Run applicaton without container: 
```
$ npm install express
$ npm install formidable
$ npm start
```
# Run application using Docker container:
Pull the alpine linux with node docker image
```
$ docker pull node:20-alpine3.17
```
Create docker image for the application
```
$ docker build -t spc/cloud-node:20-alpine3.17 .
```
Application create & start container instance
```
$ docker run -d -p 8000:8000 --name spcapp spc/cloud-node:20-alpine3.17
```
Stop the container instance
```
$ docker stop spcapp
```
Start the container instance after it has been stopped
```
$ docker start spcapp
```

