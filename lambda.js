'use strict'
const awsServerlessExpress = require('aws-serverless-express')
const RED = require('node-red');
const express = require('express');
const app = express();
const settings = require('./settings')
const when = require('when');
const http = require('http');
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


var delay = (msec) => {
  return when.promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, msec)
  })
}



const init = (() => {
  RED.init(server, settings)
  // app.use(settings.httpAdminRoot,RED.httpAdmin);
  app.use(settings.httpNodeRoot, RED.httpNode);
  return RED.start().then(() => {

    console.log('Node-RED server started.')
    return delay(1000)

  })

})()



exports.handler = (event, context, callback) => {
  init.then(() => {
    RED.nodes.loadFlows().then(() => {

      awsServerlessExpress.proxy(server, event, context)

      // const globalFlow = RED.nodes.getNode(['http in']);

      const globalFlow = RED.nodes.getNode('a8a21d26.83b6d');
      console.log('BLABLABLA');
      console.log(globalFlow);
      return callback(null, globalFlow);
    })

  })

}