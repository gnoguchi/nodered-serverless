'use strict'
const awsServerlessExpress = require('aws-serverless-express')
const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const AWS = require('aws-sdk')
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});
const s3 = new AWS.S3();
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const RED = require('node-red')
const when = require('when')


const app = express()

var settings = {
  disableEditor: true,
  httpAdminRoot: false,
  httpNodeRoot: '/',
  httpStatic: 'public',
  userDir: '/tmp/',
  logging: {
    console: {
      level: "info",
      metrics: false,
      audit: false
    }
  },
  functionGlobalContext: {},
  credentialSecret: process.env.NODE_RED_SECRET || "a-secret-key",
  flowFile: '/tmp/' + process.env.FLOW_NAME

};

const binaryMimeTypes = [
  'application/javascript',
  'application/json',
  'application/octet-stream',
  'application/xml',
  'font/eot',
  'font/opentype',
  'font/otf',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'text/comma-separated-values',
  'text/css',
  'text/html',
  'text/javascript',
  'text/plain',
  'text/text',
  'text/xml'
]

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(awsServerlessExpressMiddleware.eventContext())

const server = awsServerlessExpress.createServer(app, null, binaryMimeTypes);

var delay = (msec) => {
  return when.promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, msec)
  })
}



const init = (() => {
  const flowFile = fs.createWriteStream('/tmp/' + process.env.FLOW_NAME);
  s3.getObject({
    Bucket: 'nodered-lambda-flows',
    Key: process.env.FLOW_NAME
  }).createReadStream().pipe(flowFile)

  const configFile = fs.createWriteStream('/tmp/' + process.env.CONFIG_FLOW);
  s3.getObject({
    Bucket: 'nodered-lambda-flows',
    Key: process.env.CONFIG_FLOW
  }).createReadStream().pipe(configFile)

  const flowCredFile = fs.createWriteStream('/tmp/' + process.env.FLOW_NAME.slice(0, process.env.FLOW_NAME.indexOf(".")) + '_cred.json');
  s3.getObject({
    Bucket: 'nodered-lambda-flows',
    Key: process.env.FLOW_NAME.slice(0, process.env.FLOW_NAME.indexOf(".")) + '_cred.json'
  }).createReadStream().pipe(flowCredFile)

  RED.init(server, settings);
  app.use(settings.httpNodeRoot, RED.httpNode);

  return RED.start().then(() => {
    console.log('Node-RED server started.')
    return delay(1000)
  })

})()

exports.handler = (event, context) => {
  init.then(() => {
    RED.nodes.loadFlows().then(() => {
      awsServerlessExpress.proxy(server, event, context)
    })
  })
}
