const WebSocket = require("ws");
const wss = new WebSocket.Server({port: 3001});

const connections = new Map();
wss.on('connection', (ws) => {
	var meta = 1;
	connections.set(ws, meta);
	ws.on("message", (messageString) => {
		var data = messageString.toString();
		console.log("Message recieved: " + data);
		// We would be sending complete jsons instead of just strings in our actual deployment
		if(data === "random") {
			var meta = connections.get(ws);
			meta *= 2;
			if(meta > 1000000) {
				ws.send("fuck you");
			} else if(meta > 10000) {
				ws.send("Benny Fucks " + meta);
			} else {
				ws.send("JK its not random " + meta);
			}
			connections.set(ws, meta);
			return;
		} else if(data === "close") {
			ws.close();
			return;
		}
	});
	ws.on("close", (event) => {
		console.log("connection closed");
	});
});
