const User = require("./User");
const GameRound = require("./GameRound");
const WebSocket = require('wss');

export class Game {
    constructor(gamemaster, gameCode) {
        this.gamemaster = gamemaster;
        this.addUser(gamemaster);
        this.gameCode = gameCode;
        this.users = new Map();
        this.rounds = [];
        this.roundNumber = 0;
    }

    getCode() {
        return this.gameCode;
    }

    // Returns true if adding user succeeds, false otherwise
    addUser(username) {
        if(!this.checkUsername(username)) return false;
        this.users.set(username, new User(username));
        return true;
    }

    // Returns true if a username is avaliable and false if it is taken
    checkUsername(username) {
        for(const user of this.users.values()){
            if(user === username) return false;
            else if(user instanceof User && user.getUsername() === username) return false;
        }

        return true;
    }

    // Returns true if user is able to be connected, false otherwise
    connectUser(websocket, username) {
        if(!this.users.has(username)) return false;

        this.users.set(websocket, this.users.get(username));
        this.users.delete(username);

        websocket.removeAllListeners("message");
        websocket.on("message", (message) => this.processMessage(websocket, message));
        websocket.on("close", (event) => this.users.get(websocket).setConnected(false)); // TODO: Convert from websocket key back to username key
        return true;
    }
}