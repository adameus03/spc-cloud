#!/bin/bash
ACI_PERS_RESOURCE_GROUP=spc
ACI_PERS_STORAGE_ACCOUNT_NAME=spcvolumesstorage
ACI_PERS_SHARE_NAME=dnpacishare

echo "Script: Obtaining the volume account key"
STORAGE_KEY=$(az storage account keys list --resource-group $ACI_PERS_RESOURCE_GROUP --account-name $ACI_PERS_STORAGE_ACCOUNT_NAME --query "[0].value" --output tsv)

if [ $? -eq 0 ]; then
	echo "Script: Obtained the volume account key as $STORAGE_KEY"

	az container create \
	--resource-group $ACI_PERS_RESOURCE_GROUP \
	--name storagealpine \
	--image alpine:latest \
	--ip-address public \
	--dns-name-label spccloudstoragecontainer2023 \
	--cpu 2 \
	--memory 2 \
	--port 5432 \
	--azure-file-volume-account-name $ACI_PERS_STORAGE_ACCOUNT_NAME \
	--azure-file-volume-account-key $STORAGE_KEY \
	--azure-file-volume-share-name $ACI_PERS_SHARE_NAME \
	--azure-file-volume-mount-path "/var/lib/postgresql/data" \
	--command-line "watch whoami"
else
	echo "Script: Failed to obtain the volume account key"
fi
