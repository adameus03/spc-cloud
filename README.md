# spc-cloud

## 22.10.2023 manual

# Live demo of the hosted container instance
1. Visit http://spc-filetransfer.eastus.azurecontainer.io
2. Try downloading the pre-stored "sample.jpg" file as an example
3. Try uploading & downloading some files.

# Run applicaton locally without container: 
?
# Run application locally using Docker Compose:
Build the Docker image:
```
spc-cloud $ docker compose up --build -d 
```
Note: If you are building the image for the first time, you need to comment-out (using the '#' symbol) the last 4 lines of the docker-compose.yaml file, like this:
```
...
volumes:
  spc-db:
    #driver: azure_file
    #driver_opts:
    #  share_name: dnpacishare
    #  storage_account_name: spcvolumesstorage1
```
After running ```docker compose up --build -d``` for the first time, uncomment those 4 lines back, and leave them as they are.

# Update the image in the Azure Container Registry 
SECTION IS OBSOLETE
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
After that, the image should have been successfully updated. You need to either request the access to Azure container instance management or ask me to restart the container instance.

# What needs to be done?
Check the issue titled "TODO"
