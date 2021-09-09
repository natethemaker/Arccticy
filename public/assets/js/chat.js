function connect() {
  socket = new WebSocket(`wss://arccticy.repl.co/`)

  socket.onopen = function() {
    connectedToServer();
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

function newMessage(message){
  const el = document.createElement("div");
  el.innerHTML = message;
	document.querySelector("#chat").appendChild(el);
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

function formatMessage(message) {
	return message
		.replaceAll(":angry:","😡")
		.replaceAll(":smile:","😀")
		.replaceAll(":tired:","🥱")
		.replaceAll(":cry:","😭")
		.replaceAll(":laugh:","🤣")
		.replaceAll(":ghost:","👻")
		.replaceAll(":sick:","🤢")
}

function sendMessage(message){
  if (!message || /^\s+$/.test(message)) return 1;
	socket?.send(`m${message}`);
	return 0;
}

function submitMessage(e){
  e.preventDefault();
	const message = formatMessage(document.getElementById('classss').value).trim();
	if (/^\s+$/.test(message)) warn("Cannot send an empty message.");
	else if (message.length > 2000) warn("Message is too long.");
	else if (sendMessage(message) != 0) warn("An error occurred");
	document.getElementById('classss').value = "";
};

socket.onmessage = ({data}) => {
  var proc = data.substring(1);
  
  console.log(data)
  switch (data[0]) {
    case "m":
      newMessage(proc)
      break;
    case "j":
      newUser(proc);
      break;
  };
};

function connectedToServer() {
  // Get the snackbar DIV
  var x = document.getElementById("snackbar");

  // Add the "show" class to DIV
  x.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}