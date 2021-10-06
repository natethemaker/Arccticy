//<a class='red'>C</a><a class='orange'>O</a><a class='yellow'>L</a><a class='green'>O</a><a class='blue'>R</a><a class='purple'>S</a><a class='pink'>!</a>

/*
 * THE DATABASE BREAKS IF YOU EDIT IT BY HAND.... DONT
 * To add someone to a role: /database replitID:role
 * You must have a role yourself
*/

const url = require("url");
const fs = require("fs");
const http = require("http");
const ws = require("ws");
const express = require("express");
const port = 8070;
const JSONdb = require('simple-json-db');
const db = new JSONdb('db/db.json');
const colors = require('colors');

const homepage = `${__dirname}/public/chat.html`;
const loginpage = `${__dirname}/public/login.html`;
const notfoundpage = `${__dirname}/public/404.html`;
const secretpage = `${__dirname}/public/sdvnjsvjdnvj.html`;
const YOINK = `${__dirname}/public/YOINK.html`

const app = express();
const server = http.createServer(app);

const wsServer = new ws.Server({
  server,
  verifyClient: function(info, callback) {
    if (info.origin.includes("arccticy.repl.co") || info.origin.includes("https://18054d4f-9e03-4d32-bb00-e621409001f5.id.repl.co")) {
      callback(true);
    } else {
      console.log(colors.red(`Someone tried to connect using a foreign domain: ${info.origin}`))
      callback(false);
    };
  }
});

app.use(express.urlencoded({ extended: true }));
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'))

app.get("/", (req, res) => {
  user = req.headers["x-replit-user-name"]
  if (req.get("X-Replit-User-Id")) {
    res.render(homepage, { user: user })
    console.log(colors.yellow(user + ' is now online!'))
  }
  else res.redirect("/login");
});

app.get("/login", (req, res) => {
  if (req.get("X-Replit-User-Id")) res.redirect("/");
  else res.sendFile(loginpage);
});

app.get("/2b2t", (req, res) => res.sendFile(secretpage));
app.get("/__logs", (req, res) => res.sendFile(YOINK));
app.get("/__repl", (req, res) => res.sendFile(YOINK));
app.all("*", (req, res) => res.sendFile(notfoundpage));


wsServer.on("connection", (sock, req) => {
  console.log(colors.yellow(`A user connected! Replit Name: ${req.headers["x-replit-user-name"]} Replit ID: ${req.headers["x-replit-user-id"]}`))
  wsServer.broadcast(`m<span class="white">` + req.headers["x-replit-user-name"] + ' joined the party!</span>')
  sock.on("message", (dataBuff) => {
    var data = String(dataBuff)
    console.log(colors.red(`Incoming data: `) + colors.magenta(data))
    var proc = data.substr(1);
    switch (data[0]) {
      case "m":
        if (proc.startsWith('/')) {
         if(proc.startsWith(`/database`)){
            if(db.get(req.headers["x-replit-user-id"]) != undefined){
              var role = db.get(req.headers["x-replit-user-id"])
              if(role != 'leaddev' || role != 'dev' || role != 'designer' || role != 'backend-dev' || role != 'marketing-assistant' || role != 'chicken'){
                var dbVar = data.substr(11);
                var ind1 = dbVar.indexOf(':');
                var name = dbVar.slice(0, ind1);
                var other = dbVar.slice(ind1 + 1, dbVar.length);
                db.set(name, other)
              }
            } else {
              sock.send(`mYou do not have permission to run that command`)
            }
          } else if(proc.startsWith('/upvote')){
            sock.send("test")
          } else {
            sock.send(`mThat command does no exist.`)
          }
        } else {
          if(db.get(req.headers["x-replit-user-id"]) != undefined){
            wsServer.broadcast(`m${db.get(db.get(req.headers["x-replit-user-id"]))}<a class='white'>${req.headers["x-replit-user-name"]}:</a> <a class='white'>${proc}</a>`)
          } else {
            var noBR = proc.replace(/<br\/>/g, '');
            wsServer.broadcast(`m<a class='orange'>${req.headers["x-replit-user-name"]}:</a> <a class='white'>${noBR}</a>`)
          }
        }
        break;
    };
  });
  sock.on("close", (code) => {
    wsServer.broadcast(`m<span class="white">` + req.headers["x-replit-user-name"] + ' disconnected.</span>')
    console.log(colors.yellow(`${req.headers["x-replit-user-name"]} disconnected.`))
  });
});

wsServer.broadcast = function broadcast(msg) {
  console.log(colors.red(`Outgoing Data: `) + colors.blue(msg));
  wsServer.clients.forEach(function each(client) {
    client.send(msg);
  });
};

server.listen(port, () => console.log(colors.green(`Listening on port ${port}.`)));