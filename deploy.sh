#!/bin/bash
echo -e "########################################"
read -n1 -e -p "Type 'c' - Create, 'u' - Update or 'd' to Destroy lambda function. [c] or [u] or [d]:" choice
echo -e "########################################"



if [ "$choice" == "c" ]; then
    claudia create --handler lambda.handler --profile default --set-env HOME=/tmp,FLOW_NAME=$FLOW_NAME,ACCESS_KEY_ID=$ACCESS_KEY_ID,SECRET_ACCESS_KEY=$SECRET_ACCESS_KEY,CONFIG_FLOW=$CONFIG_FLOW --memory 1280 --timeout 10  --deploy-proxy-api --region us-west-2 
elif [ "$choice" == "u" ]; then
    claudia update --handler lambda.handler --profile default --set-env HOME=/tmp,FLOW_NAME=$FLOW_NAME,ACCESS_KEY_ID=$ACCESS_KEY_ID,SECRET_ACCESS_KEY=$SECRET_ACCESS_KEY,CONFIG_FLOW=$CONFIG_FLOW --memory 1280 --timeout 10  --deploy-proxy-api --region us-west-2
elif [ "$choice" == "d" ]; then
    claudia destroy --handler lambda.handler --profile default --set-env HOME=/tmp,FLOW_NAME=$FLOW_NAME,ACCESS_KEY_ID=$ACCESS_KEY_ID,SECRET_ACCESS_KEY=$SECRET_ACCESS_KEY,CONFIG_FLOW=$CONFIG_FLOW --memory 1280 --timeout 10  --deploy-proxy-api --region us-west-2
else
    echo "Error: invalid option!"
fi
#