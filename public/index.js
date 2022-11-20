let socket = null;


function connectSocket() {
	console.log("attempting to connect");
	socket = new WebSocket("ws://localhost:3001");
	socket.onopen = function(e) {
		document.getElementById("status-text").textContent = "Websocket Connected";
	}
	socket.onmessage = function(e) {
		console.log(e.data);
		document.getElementById("random-text").textContent = e.data;
	}
	socket.onclose = function(e) {
		document.getElementById("status-text").textContent = "Websocket Not Connected";
		socket = null;
	}
}

function randomizeText() {
	console.log("randomizing text");
	if(socket == null) return;

	socket.send("random");
}


var connectButton = document.getElementById("connect-button");
connectButton.addEventListener("click", connectSocket);

var randomizeButton = document.getElementById("randomize-button");
randomizeButton.addEventListener("click", randomizeText);
