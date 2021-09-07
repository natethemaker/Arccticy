var socket;
function connect() {
  socket = new WebSocket('ws://arccticy.repl.co:8080');

  socket.onopen = function() {
    socket.send(`o${localStorage.username}`)
  }

  socket.onclose = function(e) {
    console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
    setTimeout(function() {
      connect();
    }, 1000);
  };

  socket.onerror = function(err) {
    socket.close();
  };
}
connect();

function newMessage(origin, name, message){
  var chatchild = document.createElement("div");
  chatchild.style.width = "100%";
  chatchild.style.height = "3.5%";
  chatchild.style.background = "transparent";
  chatchild.style.borderBottomWidth = "3px";
  chatchild.style.borderBottomStyle = "solid";
  chatchild.style.borderBottomColor = "rgb(0, 64, 255)";
  chatchild.style.color = "white";
  chatchild.innerHTML = `(${origin}) ${name}: ${message}`;
  document.getElementById("chat").appendChild(chatchild);
  document.querySelector("#chat").scrollTop = 1000000000000000;
};

function newUser(name){
  var chatchild = document.createElement("div");
  chatchild.style.width = "100%";
  chatchild.style.height = "3.5%";
  chatchild.style.background = "transparent";
  chatchild.style.borderBottomWidth = "3px";
  chatchild.style.borderBottomStyle = "solid";
  chatchild.style.borderBottomColor = "rgb(0, 64, 255)";
  chatchild.style.color = "lime";
  chatchild.innerHTML = `${name} is now online!`;
  document.getElementById("chat").appendChild(chatchild);
  document.querySelector("#chat").scrollTop = 1000000000000000;
};

if(!localStorage.username){
  var asname = prompt('Set a username:')
  localStorage.username = asname;
}
//in the chat wil html or at least limited html be implamented
function submitMessage(e){
  e.preventDefault();
  var n = localStorage.username;
  var m = document.getElementById('classss').value;
  if(m == '' || m == ' ' || m == '  '){
    alert('Your message must have content and cant have the symbol "|" in it.');
    document.getElementById('classss').value = '';
  } else {
    if(m.includes('|')){
      var mx = m.replaceAll("|", " ");
      if(mx == '' || mx == ' ' || mx == '  '){
        alert('Your message must have content and cant have the symbol "|" in it.');
        document.getElementById('classss').value = '';
      } else {
        socket.send(`mw${localStorage.username}|${mx}`);
        document.getElementById('classss').value = '';
      };
    } else {
      socket.send(`mw${localStorage.username}|${m}`);
      document.getElementById('classss').value = '';
    };
  };
};

socket.onmessage = ({data}) => {
  var proc = data.substring(1);
  var plat = proc.substring(1);
  var proc1110101 = proc.toString();
  var ind1 = plat.indexOf('|');
  var name = plat.slice(0, ind1);
  var msg = plat.slice(ind1 + 1, plat.length);
  switch (data[0]) {
    case "m":
      switch (proc[0]) {
        case "w":
          newMessage('Website', name, msg)
          break;
        case "d":
          newMessage('Discord', name, msg)
          break;
        case "m":
          newMessage('Minecraft', name, msg)
          break;
      };
      break;
    case "j":
      newUser(proc);
      break;
  };
};