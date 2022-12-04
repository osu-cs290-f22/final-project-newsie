class User {
    constructor(username) {
        this.connected = false;
        this.username = username;
        this.points = 0;
        this.websocket = null;
    }

    setWebsocket(websocket) {
        this.connected = true;
        this.websocket = websocket;
    }

    getWebsocket() {
        return this.websocket;
    }

    getUsername() {
        return this.username;
    }

    getPoints() {
        return this.points;
    }

    addPoints(points) {
        this.points += points;
    }

    setConnected(connected) {
        this.connected = connected;
    }

    getConnected(connected) {
        return connected;
    }
}

module.exports = User;