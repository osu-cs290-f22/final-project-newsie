const http = require("http")
const url = require('url')
const fs = require('fs')
const express = require('express')
const GameManager = require('./server/GameManager')

const app = express()
const port = 3000

const contents = readFileSync("subtitles.txt", 'utf-8')
const arr = contents.split(/\r?\n/)

const manager = new GameManager();

app.listen(port, function(){
    console.log("Server listening!")
})

app.use(express.json())
app.use(express.static("public"))

//Returns a random subtitle
app.get("/subtitle", function(req, res, next){
    const random = Math.floor(Math.random() * arr.length)
    res.status(200).send(arr[random])
})


//Getting the game code. If there exists a game with that code, respond true.
app.get("/", function(req, res, next){

    if(req.query.game){
        const game = req.query.game;

        if (manager.checkGameCode(game)){
            res.status(204).send()
        } else {
            res.status(400).send()
        }

    }else{
        res.status(404).send()
    }
})


//Getting the game code and username. If there exists a game with that code and username, respond with status 200.
app.post("/", function(req, res, next){

    if(req.query.game && req.query.name){
        const game = req.query.game;
        const name = req.query.name;
        const decodedName = decodeURIComponent(name)

        if(manager.checkUsername(game, name)){
            //add user to game if it's unique

            res.status(201).send()
        }else{
            res.status(200).send()
        }
    }else{
        next()
    }
})

//Creating new game. Takes owner name and creates a game object with them as owner. Returns game code.
app.post("/", function(req, res, next){
    if(req.query.name){
        const ownerName = req.query.name;
        const decodedOwnerName = decodeURIComponent(ownerName)
        res.status(201).send(manager.newGame(decodedOwnerName))
    }else{
        res.status(404).send()
    }
})


 