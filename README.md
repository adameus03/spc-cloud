# spc-cloud
## 14.10.2023 manual

# Live demo of the hosted container instance
1. Visit http://20.56.243.165:8000/
2. Try downloading the pre-stored "sample.jpg" file as an example
3. Try uploading & downloading some files.

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

# Update the image in the Azure Container Registry 
For updating production:
```
docker login spccloud.azurecr.io --username spccloud
```
The password is of course not provided here for security reasons. 
If you already created the spccloud.azurecr.io/cloud-node:20-alpine3.17 image, before proceeding, please run
```
$ docker image rm spccloud.azurecr.io/cloud-node:20-alpine3.17
```
Create the docker image for Azure:
```
$ docker build -t spccloud.azurecr.io/cloud-node:20-alpine3.17 .
```
Push the application docker image to the Azure server
```
$ docker push spccloud.azurecr.io/cloud-node:20-alpine3.17
```
