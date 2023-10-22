# spc-cloud

## 22.10.2023 manual

# Live demo of the hosted container instance
```diff
- CURRENTLY DOWN TO REDUCE COSTS ¯\_(ツ)_/¯
```
1. Visit http://spc-filetransfer.eastus.azurecontainer.io
2. Try downloading the pre-stored "sample.jpg" file as an example
3. Try uploading & downloading some files.

# Run applicaton locally without container:
If you would like to run the server without using Docker container, please follow the below steps:
1. Install sqlite3:
```
$ sudo apt-get install sqlite3
```
2. Copy the spc-cloud/.env file into the spc-cloud/src/bin directory:
```
spc-cloud $ cp .env src/bin/
```
3. Run ```spc-cloud/src $ npm install```
4. Run ```spc-cloud/src $ /bin/sh ./start.sh```
   
The application server should now be running directly in the host OS, using the port specified in the .env file (80 by default)\
If you encounter problems, please create an issue for this repository. 
# Run application locally using Docker Compose (recommended for development):
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


# Update the image in the Azure Container Registry (use to update the application hosted at Azure)
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
After successful push, the image should have been successfully updated.\
If you wish you can now proceed to starting the Azure Container Instance (ACI).
# Run and stop the live remote container 
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

# What needs to be done?
Check the issue titled "TODO"
