const User = require("./User");
const Roudn = require("./Round");
const WebSocket = require('wss');

const GameState = {
    lobby: "lobby",
    submission: "submission",
    voting: "voting",
    roundEnd: "roundEnd",
    gameEnd: "gameEnd"
}

class Game {
    constructor(gamemaster, gameCode) {
        this.gamemaster = gamemaster;
        this.gameCode = gameCode;
        this.users = new Map();
        this.rounds = [];
        this.addUser(gamemaster);
        this.roundNumber = 0;
        this.gamestate = GameState.lobby;
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
        for(let user of this.users.values()){
            if(user.getUsername() === username) return false;
        }

        return true;
    }

    // Returns true if user is able to be connected, false otherwise
    connectUser(websocket, username) {
        if(!this.users.has(username)) return false;

        this.users.set(websocket, this.users.get(username));
        this.users.delete(username);

        this.users.get(websocket).setWebsocket(websocket);

        websocket.removeAllListeners("message");
        websocket.on("message", (message) => this.processMessage(websocket, message));
        websocket.on("close", function(event) {
            this.users.set(this.users.get(websocket).getUsername(), this.users.get(websocket));
            this.users.delete(websocket);
        });
        return true;
    }

    processMessage(websocket, mes) {
        let user = this.users.get(websocket);

        switch(this.gamestate) {
            case GameState.roundEnd:
            case GameState.lobby:
                if(user.getUsername() === this.gamemaster){
                    if(mes.toString() === "GET THIS VALUE FROM VVILL"){
                        startRound();
                    }
                }
                break;
            case GameState.submission:
                this.rounds[roundNumber].submitImage(user, JSON.parse(mes));
                if(this.rounds[roundNumber].isSubmissionComplete()){
                    endSubmission();
                }
                break;
            case GameState.voting:
                this.rounds[roundNumber].submitVotes(user, JSON.parse(mes));
                if(this.rounds[roundNumber].isVotingComplete()){
                    endVoting();
                }
                break;
            default:
                websocket.send("ERROR: Currently not accepting messages, in state: " + this.gamestate);
                break;
        }
    }

    startRound() {

    }

    endSubmission() {
        this.gamestate = GameState.voting;
        this.rounds[this.roundNumber].setSubmissionComplete(true);

        let imageData = [];
        for(submission in this.rounds[this.roundNumber].getSubmissions()){
            imageData.push(submission.image);
        }

        let startDate = new Date();
        let endDate = new Date();
        startDate.setSeconds(startDate.getSeconds() + 5);
        endDate.setSeconds(endDate.getSeconds + 65);

        let data = {
            images: imageData,
            voteStart: startDate.getTime(),
            voteEnd: endDate.getTime(),
            roundNumber: this.roundNumber
        };

        let jsonString = JSON.stringify(data);
        for(ws in this.users.keys()){
            ws.send(jsonString);
        }
    }

    forceEndSubmission() {
        if(this.rounds[this.roundNumber].isSubmissionComplete()) return;

        this.endSubmission();
    }

    endVoting() {
        this.gamestate = GameState.roundEnd;
        this.rounds[this.roundNumber].setVotingComplete(true);

        this.rounds[this.roundNumber].tallyVotes();
        let talliedVotes = this.rounds[this.roundNumber].getTalliedVotes();
    }
}

module.exports = Game;