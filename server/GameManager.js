const Game = require("./Game");

const characters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
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
        code = '';
        for(var i = 0; i < 6; i++) {
            code += characters[Math.floor(Math.random * characters.length)];
        }
        return code;
    }
}