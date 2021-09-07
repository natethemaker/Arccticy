//Ect. Configs
const fs = require('fs');
var rateLimit = require('ws-rate-limit');
var limiter = rateLimit('60s', 30);
const fetch = require('fetch');
//Express Configs
const express = require('express');
const app = express();
const expPort = 3000;
//Websocket Configs
const wsPort = 8080;
const ws = require('ws');
const wsServer = new ws.Server({
  port: `${wsPort}`,
  verifyClient: function(info,callback){
    if (info.origin.includes("repl.co")) {
      console.log('Connection Accepted')
      callback(true);
    } else {
      console.log(info.origin)
      callback(false);
    };
  }
});

//Express Server
app.get('/', function(req, res) {
  res.sendFile('public/home.html', {root: __dirname })
});

app.use('/', express.static(__dirname + '/public'));

app.listen(expPort, () => {
  console.log(`Express Server Started on Port: ${expPort}`);
});

//Websocket Server
wsServer.on('connection', function connection(ws) {
  console.log('Connection made!')
  limiter(ws);
    ws.on('limited', (wss) => {
    console.log('A user was rate limited.');
  });
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
});