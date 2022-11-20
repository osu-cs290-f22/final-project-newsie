var http = require("http")
var app = express()
var port = 3001

app.listen(port, function(){
    console.log("Server listening!")
})

app.use(express.static("public"))

app.get("/:gamecode/:username", function(req, res, next){


})


