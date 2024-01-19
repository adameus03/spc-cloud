#!/bin/sh
SCRIPT_NICKNAME="Start script"
VOLUME_GUARD_PATH="./persistent_volume_guard.sh"
#DOTENV_PATH="./bin/.env"
CONFIG_PATH="./config.sh"
echo "$SCRIPT_NICKNAME: Running packages upgrade"
apk update && apk upgrade
git config --global user.email you@example.com
git config --global user.name "Your Name"
#echo "Start script: starting watch whoami in background"
#watch whoami

if [ ! $? -eq 0 ]; then
    echo "$SCRIPT_NICKNAME: WARNING - Failed to update/upgrade the packages. Proceeding with the current version."
fi

#env_setup() {
#    if [ ! -f $DOTENV_PATH ]; then
#        echo "$SCRIPT_NICKNAME: Creating .env file in the bin directory."
#    else
#        echo "$SCRIPT_NICKNAME: Updating .env file in the bin directory."
#    fi
#    tail -n +2 $CONFIG_PATH > $DOTENV_PATH
#}

echo "$SCRIPT_NICKNAME: Setting environment variables..."
chmod u+rx $CONFIG_PATH
. $CONFIG_PATH
#chmod u+rx $DOTENV_PATH #defensive
#. $DOTENV_PATH
# sed 's/^/export /' "$DOTENV_PATH" | sh



if [ $? -eq 0 ]; then
    #env_setup
    #if [$? -eq 0 ]; then
        /bin/sh $VOLUME_GUARD_PATH
        if [ $? -eq 0 ]; then
            echo "$SCRIPT_NICKNAME: setup db sync..."
            npm run migrate

            if [ $? -eq 0 ]; then
                echo "$SCRIPT_NICKNAME: Launching core application..."
                npm run pm2
            else
                echo "$SCRIPT_NICKNAME: ERROR - Failed to setup db sync"
            fi
        else
            echo "$SCRIPT_NICKNAME: ERROR - Persistent volume guard error" 
        fi
    #else
    #    echo "$SCRIPT_NICKNAME: ERROR - env setup failed. Maybe a permissions issue?"
    #fi


    
else 
    echo "$SCRIPT_NICKNAME: ERROR - Failed to set environment variables, check for corrupted or inaccessible config.sh file"
fi