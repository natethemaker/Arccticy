const url = require("url");
const fs = require("fs");
const crypto = require("crypto");
const http = require("http");
const ws = require("ws");
const express = require("express");
const port = 8070;
const JSONdb = require('simple-json-db');
const roles = new JSONdb(`db/roles.json`);
const users = new JSONdb(`db/users.json`);
// returning error ^^^
const homepage = `${__dirname}/public/chat.html`;
const loginpage = `${__dirname}/public/login.html`;
const notfoundpage = `${__dirname}/public/404.html`;

const app = express();
const server = http.createServer(app);

const wsServer = new ws.Server({
  server,
  verifyClient: function(info,callback){
    if (info.origin.includes("arccticy.repl.co")) {
      callback(true);
    } else {
      console.log(info.origin)
      callback(false);
    };
  }
});

app.use(express.urlencoded({ extended: true }));
app.engine('html',require('ejs').renderFile);
app.use(express.static('public'))

app.get("/", (req, res) => {
  user = req.headers["x-replit-user-name"]
	if (req.get("X-Replit-User-Id")){
    res.render(homepage, {user:user})
    console.log(user + ' is now online!')
  }
	else res.redirect("/login");
});

app.get("/login", (req, res) => {
	if (req.get("X-Replit-User-Id")) res.redirect("/");
	else res.sendFile(loginpage);
});

app.all("*", (req, res) => res.sendFile(notfoundpage));


wsServer.on("connection", (sock, req) => {
  console.log(`A user connected! Replit Name: ${req.headers["x-replit-user-name"]} Replit ID: ${req.headers["x-replit-user-id"]}`)
  sock.on("message", (dataBuff) => {
    var data = String(dataBuff)
    console.log(data)
    var proc = data.substr(1);
    switch (data[0]) {
      case "m":
        if(proc.startsWith('/')){
          sock.send(`m${roleSel()}<a class='orange'>${req.headers["x-replit-user-name"]}:</a> <a class='white'>${username}</a>`)
          
          if(proc == '/test'){
            wsServer.broadcast(`m${roleSel()}<a class='orange'>${req.headers["x-replit-user-name"]}:</a> <a class='white'>${proc}</a>`)
          } else {

          }

        } else {
          function roleSel(){
          console.log(req.headers["x-replit-user-id"])
          if(users.has(`${req.headers["x-replit-user-id"]}`)){
            var usersRole = users.get(req.headers["x-replit-user-id"]);
            return roles.get(usersRole);
          } else {
            return '';
          }
        };
        wsServer.broadcast(`m${roleSel()}<a class='orange'>${req.headers["x-replit-user-name"]}:</a> <a class='white'>${proc}</a>`)
        }
        break;
    };
  });
	sock.on("close", (code) => {

	});
});

wsServer.broadcast = function broadcast(msg) {
   console.log(msg);
   wsServer.clients.forEach(function each(client) {
       client.send(msg);
    });
};

server.listen(port, () => console.log(`Listening on port ${port}.`));