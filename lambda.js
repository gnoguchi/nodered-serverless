'use strict'
const express = require('express')
const axios = require('axios')
const fs = require('fs')
const AWS = require('aws-sdk')
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});
const s3 = new AWS.S3();
const RED = require('node-red')
const http = require('http')
const app = express()
app.use("/", express.static("public"));

const server = http.createServer((req, res) => {
  app(req, res)
}
)

const settings = {
  disableEditor: true,
  httpNodeRoot: "/",
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
  flowFile: '/tmp/' + process.env.FLOW_NAME,
  editorTheme: {
    palette: {
      catalogues: [
        "https://catalogue.nodered.org/catalogue.json",
        "http://catalog.shared.sinapse-ps.com:9101/catalogue.json"
      ]
    }
  }
}

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
    Bucket: process.env.S3_BUCKET,
    Key: process.env.FLOW_NAME
  }).createReadStream().pipe(flowFile)

  const configFile = fs.createWriteStream('/tmp/' + process.env.CONFIG_FLOW);
  s3.getObject({
    Bucket: process.env.S3_BUCKET,
    Key: process.env.CONFIG_FLOW
  }).createReadStream().pipe(configFile)

  const flowCredFile = fs.createWriteStream('/tmp/' + process.env.FLOW_NAME.slice(0, process.env.FLOW_NAME.indexOf(".")) + '_cred.json');
  s3.getObject({
    Bucket: process.env.S3_BUCKET,
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
  
  context.callbackWaitsForEmptyEventLoop = false
  let dataBody = null
  let buff = null
  if (event.body !== null && event.body !== undefined) {
    buff = new Buffer(event.body, 'base64')
    dataBody = buff.toString('ascii')
  }
  init.then(() => {
    server.listen(1880)
    RED.nodes.loadFlows().then(() => {

      axios({
        method: event.httpMethod,
        url: 'http://localhost:1880' + event.path,
        data: JSON.parse(dataBody)
      }).then((response) => {
        const responseBody = {
          statusCode: 200,
          headers: {
            "Function-Name": ""
          },
          body: JSON.stringify(response.data),
          isBase64Encoded: false
        }
        callback(null, responseBody)
      }).catch((err) => {
        callback(err)
      })
    })
  })
}
