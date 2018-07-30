'use strict'
const awsServerlessExpress = require('aws-serverless-express')
const RED = require('node-red');
const express = require('express');
const app = express();
const settings = require('./settings')
const binaryMimeTypes = [
	'application/octet-stream',
	'font/eot',
	'font/opentype',
	'font/otf',
	'image/jpeg',
	'image/png',
	'image/svg+xml'
]

const server = awsServerlessExpress.createServer(app, null, binaryMimeTypes)

var init = (() => {
  RED.init(server, settings)
  // app.use(settings.httpAdminRoot,RED.httpAdmin);
  app.use(settings.httpNodeRoot, RED.httpNode);
  return RED.start().then(() => {
    console.log('Node-RED server started.')
  })

})()



exports.handler = (event, context) => {
  init.then(() => {
    RED.nodes.loadFlows().then(() => {
      awsServerlessExpress.proxy(server, event, context)
    })
  })
}