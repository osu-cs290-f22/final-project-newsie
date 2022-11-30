const http = require("http")
const url = require('url');
const express = require('express');

const app = express()
const port = 3000


//Reads serverData.json and returns an array of gameObjects
function getExistingGameObjects(){

    const jsonString = fs.readFileSync('./server.json', 'utf8')
  
    try {
        const data = JSON.parse(jsonString)
        return data.gameObjects
        
    } catch(err) {
        console.log('Error parsing JSON string:', err)
    }
}

//Takes a game code and checks to see if it is already in use
function isExistingGame(gameCode) {
    var existingGameObjects = getExistingGameCodes()

    for (var i = 0; i < existingGameObjects.length; i++) {
        if (existingGameObjects[i].gameCode == gameCode) {
            return true
        }
    }
    return false
}

//Checks to see if the name is already in use in the game. Returns false if it is.
function isUniqueName(gameCode, name){
    var existingGameObjects = getExistingGameObjects()

    for (var i = 0; i < existingGameObjects.length; i++) {
        if (existingGameObjects[i].gameCode == gameCode) {
            for (var j = 0; j < existingGameObjects[i].users.length; j++) {
                if (existingGameObjects[i].users[j].username == name) {
                    return false
                }
            }
            return true
        }
    }
}

app.listen(port, function(){
    console.log("Server listening!")
})

app.use(express.json())
app.use(express.static("public"))


//Getting the game code. If there exists a game with that code, respond true.
app.get("/url", function(req, res, next){
    const game = req.query.game;
    res.status(200).send(isExistingGame(game))
})


//Getting the game code and username. If there exists a game with that code and username, respond false.
app.post("/", function(req, res, next){
    const game = req.query.game;
    const name = req.query.name;

    if(isUniqueName(game, name)){
        //add user to game
        res.status(200).send(true)
    }else{
        res.status(200).send(false)
    }
})


 