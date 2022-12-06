const Game = require("./Game");

class GameManager {
    
    constructor() {
        this.games = new Map();
    }

    newGame(gamemaster) {
        let gamecode = this.generateGameCode();
        this.games.set(gamecode, new Game(gamemaster, gamecode));
        return gamecode;
    }

    removeGame(gamecode) {
        this.games.delete(gamecode);
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
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    static getInstance() {
        return instance;
    }
}
const instance = new GameManager();

module.exports = GameManager;
