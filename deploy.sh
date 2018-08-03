#!/bin/bash
echo -e "########################################"
read -e -p "Type 'c' - Create or 'u' - Update lambda function. [c] ou [u]:" choice
echo -e "########################################"



if [ "$choice" == "c" ]; then
    claudia create --handler lambda.handler --set-env HOME=/tmp  --deploy-proxy-api --region us-west-2 
elif [ "$choice" == "u" ]; then
    claudia update --handler lambda.handler --set-env HOME=/tmp --deploy-proxy-api --region us-west-2
else
    echo "Error: invalid option!"
fi
#