# nodered-serverless

##Deploy AWS lambda project:

1 - Install needed dependencies. e.g: Node 8(at least), npm(compatible to node 8 versions), Claudiajs, AWS CLI, etc.
2 - Set needed environment variables as well as AWS credentials and edit 'deploy-env.sh' file(if necessary)  
3 - Deploy project using the 'deploy.sh' script choosing the right option 'c' - Create, 'u' - Update, 'd' - delete function

###IMPORTANT: Files such as 'flows.json', 'flows_cred.json' and '.config.json'(might have different names) that Node-Red uses to run must exist in the AWS S3 bucket with the same name of the var envs fed in the 'deploy-env.sh' file including the S3 bucket used.

##Running Node-Red:

1 - Get URL generated on Claudia deploy log or from the AWS API Gateway Stage
2 - Invoke Node-Red using the URL got previosly plus the path endpoint expected in the 'http in' node inside Node-Red flow(in case of having 'http in' as flow trigger)


