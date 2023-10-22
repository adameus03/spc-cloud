# spc-cloud

## 22.10.2023 manual

# Live demo of the hosted container instance
1. Visit http://spc-filetransfer.eastus.azurecontainer.io
2. Try downloading the pre-stored "sample.jpg" file as an example
3. Try uploading & downloading some files.

# Run applicaton locally without container: 
?
# Run application locally using Docker Compose:
Always make sure using the correct Docker context, by executing:
```
spc-cloud $ docker context use default
```
Build the Docker image:
```
spc-cloud $ docker compose up --build -d 
```
Note 1: This will run the container as soon as the image is built. \
Note 2: If you are building the image for the first time, you need to comment-out (using the '#' symbol) the last 4 lines of the docker-compose.yaml file, like this:
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

If the image is already built, starting or stopping the container is as easy as running ```docker compose up``` or ```docker compose down```.


# Update the image in the Azure Container Registry 
SECTION IS OBSOLETE
To update the production container image, first you need to install the Azure CLI.
Then you can login into the ACR/container group:
```
$ az acr login --name spccloud
```
Note: Before trying to login, you should make sure the Docker context is set as "default" \
Now you can push the current container image build into the ACR:
```
spc-cloud $ docker-compose push
```
After successful push, you can can proceed to starting the Azure Container Instance (ACI). \
In order to do that you first need to switch the Docker context from "default" to a context associated with Azure. \
Check available Docker contexts by running:
```$ docker context ls```
The current context is always marked with the star "*" symbol. If you haven't yet created a context associated with Azure, then you can create one using 
```docker context create aci myacicontext```. \
To switch the current context you need to run:
```
$ docker context use myacicontext
```
After that you can run or stop the production container by running
```
  $ docker compose up
```
or 
```
  $ docker compose down
```
WARNING: This will change the state of the contaner, and affect the operating costs measured by Azure.


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
