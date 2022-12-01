const Game = require("./Game");

export class GameManager {
    constructor() {
        this.games = new Map();
    }

    newGame(gamemaster) {
        let gamecode = this.generateGameCode();
        this.games.set(gamecode, new Game(gamemaster, gamecode));
    }

    checkGameCode(gamecode) {
        return this.games.has(gamecode);
    }

    checkUsername(gamecode, username){
        if(!this.games.has(gamecode)) return false;

        return this.games.get(gamecode).addUser(username);
    }

    connectUser(websocket, gamecode, username){
        if(!this.games.has(gamecode)) return false;

        return this.games.get(gamecode).connectUser(websocket, username);
    }

    generateGameCode() {
        return Math.random().toString(36).substring(2, 8);
    }
}