#!/bin/bash
echo -e "########################################"
read -n1 -e -p "Type 'c' - Create, 'u' - Update or 'd' to Destroy lambda function. [c] or [u] or [d]:" choice
echo -e "########################################"

source ./deploy-env.sh

echo "FLOW_NAME=$FLOW_NAME"
echo "CONFIG_FLOW=$CONFIG_FLOW"
echo "ACCESS_KEY_ID=$ACCESS_KEY_ID"
echo "SECRET_ACCESS_KEY=$SECRET_ACCESS_KEY"
echo "S3_BUCKET=$S3_BUCKET"

if [ "$choice" == "c" ]; then
    claudia create --handler lambda.handler --profile default --set-env HOME=/tmp,FLOW_NAME=$FLOW_NAME,ACCESS_KEY_ID=$ACCESS_KEY_ID,SECRET_ACCESS_KEY=$SECRET_ACCESS_KEY,CONFIG_FLOW=$CONFIG_FLOW,S3_BUCKET=$S3_BUCKET --memory 1280 --timeout 10  --deploy-proxy-api --region us-west-2 
elif [ "$choice" == "u" ]; then
    claudia update --handler lambda.handler --profile default --set-env HOME=/tmp,FLOW_NAME=$FLOW_NAME,ACCESS_KEY_ID=$ACCESS_KEY_ID,SECRET_ACCESS_KEY=$SECRET_ACCESS_KEY,CONFIG_FLOW=$CONFIG_FLOW,S3_BUCKET=$S3_BUCKET --memory 1280 --timeout 10  --deploy-proxy-api --region us-west-2
elif [ "$choice" == "d" ]; then
    claudia destroy --handler lambda.handler --profile default --set-env HOME=/tmp,FLOW_NAME=$FLOW_NAME,ACCESS_KEY_ID=$ACCESS_KEY_ID,SECRET_ACCESS_KEY=$SECRET_ACCESS_KEY,CONFIG_FLOW=$CONFIG_FLOW,S3_BUCKET=$S3_BUCKET --memory 1280 --timeout 10  --deploy-proxy-api --region us-west-2
else
    echo "Error: invalid option!"
fi
#