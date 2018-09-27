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
    claudia create --config nodered-lambda.json --runtime nodejs8.10 --region $LAMBDA_REGION --deploy-proxy-api --handler lambda.handler --version dev --profile default --set-env HOME=/tmp,FLOW_NAME=$FLOW_NAME,CLAUDIA_AWS_ACCESS_KEY_ID=$CLAUDIA_AWS_ACCESS_KEY_ID,CLAUDIA_AWS_SECRET_ACCESS_KEY=$CLAUDIA_AWS_SECRET_ACCESS_KEY,CONFIG_FLOW=$CONFIG_FLOW,S3_BUCKET=$S3_BUCKET --memory 3008 --timeout 10 --role arn:aws:iam::849805908400:role/nodered-lambda --name nodered-lambda
elif [ "$choice" == "u" ]; then
    claudia update --config nodered-lambda.json --runtime nodejs8.10 --region $LAMBDA_REGION --deploy-proxy-api --handler lambda.handler --version dev --profile default --set-env HOME=/tmp,FLOW_NAME=$FLOW_NAME,CLAUDIA_AWS_ACCESS_KEY_ID=$CLAUDIA_AWS_ACCESS_KEY_ID,CLAUDIA_AWS_SECRET_ACCESS_KEY=$CLAUDIA_AWS_SECRET_ACCESS_KEY,CONFIG_FLOW=$CONFIG_FLOW,S3_BUCKET=$S3_BUCKET --memory 3008 --timeout 10 --role arn:aws:iam::849805908400:role/nodered-lambda --name nodered-lambda
elif [ "$choice" == "d" ]; then
    claudia destroy --config nodered-lambda.json --runtime nodejs8.10 --region $LAMBDA_REGION --deploy-proxy-api --handler lambda.handler --version dev --profile default --set-env HOME=/tmp,FLOW_NAME=$FLOW_NAME,CLAUDIA_AWS_ACCESS_KEY_ID=$CLAUDIA_AWS_ACCESS_KEY_ID,CLAUDIA_AWS_SECRET_ACCESS_KEY=$CLAUDIA_AWS_SECRET_ACCESS_KEY,CONFIG_FLOW=$CONFIG_FLOW,S3_BUCKET=$S3_BUCKET --memory 3008 --timeout 10 --role arn:aws:iam::849805908400:role/nodered-lambda-executor --name nodered-lambda  
else
    echo "Error: invalid option!"
fi
#