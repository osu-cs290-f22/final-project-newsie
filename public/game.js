let submitCanvas = document.createElement('canvas');
submitCavas.width = 800;
submitCavas.height = 600;
let voteOrder = [];

function updateUserList(e){
    if(typeof(e.data) == "string"){
        e.data = JSON.parse(e.data);
    }
    if(e.data.id == 'round'){
        ws.removeEventListener("message", updateUserList, false);
        ws.addEventListener("message", newRound, false);
        newRound(e);
    }
    else{
        let ul = document.getElementById("lobby"+(owner?"Master":"")).getElementsByTagName('ul')[0];
        ul.innerHTML = "";
        for(i of e.data.usernames){
            ul.innerHTML += "<li>"+i+"</li>";
        }
    }
}
function newRound(e){
    if(typeof(e.data) == "string"){
        e.data = JSON.parse(e.data);
    }
    if(e.data.id == "images"){
        ws.removeEventListener("message", newRound, false);
        ws.addEventListener("message", populateImages, false);
        populateImages(e);
    }else if(e.data.id == "end"){
        ws.removeEventListener("message", newRound, false);
        gameOver(e);
    }else{
        document.getElementsByClassName("active")[0].style.animation = "moveOut 1s linear 0s 1";
        setTimeout(function(){document.getElementsByClassName("active")[0].classList.remove("active")}, 1000);
        document.getElementById("prompt").parentElement.classList.add("active");
        document.getElementById("prompt").parentElement.style.animation = "moveIn 1s linear 0s 1";
        
        document.getElementById("prompt").getElementsByTagName("h2").innerText = "\"" + e.data.headline + "\"";
        document.getElementById("prompt").getElementsByTagName("h3").innerText = Math.floor(new Date(e.data.roundEnd) - new Date(e.data.roundStart) / 60000) + ((new Date(e.data.roundEnd) - new Date(e.data.roundStart) % 60000) / 1000).toFixed(0);
        let interval = setInterval(function(){
            if(new Date() >= new Date(e.data.roundStart)){
                document.getElementById("prompt").getElementsByTagName("h3").innerText = Math.floor(new Date(e.data.roundEnd) - new Date() / 60000) + ((new Date(e.data.roundEnd) - new Date() % 60000) / 1000).toFixed(0);
            }
            else if(new Date() >= new Date(e.data.roundEnd)){
                document.getElementById("prompt").getElementsByTagName("h3").innerText = "00:00";
                clearInterval(interval);
            }
        }, 1000);
    }
}
function newFile(file){
    let img = new Image();
    try{
        let f = new FileReader();
        f.onload = function(e){
            img.src = e.target.result;
        }
        f.readADataURL(file);
    }catch{
		window.alert("Error processing file into an image.");
		console.error("Image Draw Error: " + e);
        return;
    }
	let c = document.createElement("canvas");
	img.onload = function(){
	   if(img.naturalHeight / img.naturalWidth > 0.75){
            c.width = img.naturalWidth;
            c.height = img.naturalWidth * 0.75;
            try{
                c.getContext("2d").drawImage(img, 0, -(img.naturalHeight - c.height)/2);
            }catch(e){
                window.alert("Error processing image. Try again with a different file type.");
                console.error("Image Draw Error: " + e);
            }
	   }else{
            c.height = img.naturalHeight;
            c.width = img.naturalHeight * 1.33;
            try{
                c.getContext("2d").drawImage(img, -(img.naturalWidth - c.width)/2, 0);
            }catch(e){
                window.alert("Error processing image. Try again with a different file type.");
                console.error("Image Draw Error: " + e);
            }
	   }
	   document.getElementById('prompt').getElementsByTagName('canvas')[0].getContext("2d").drawImage(c, 0,0, document.getElementById('prompt').getElementsByTagName('canvas')[0].width, document.getElementById('prompt').getElementsByTagName('canvas')[0].height);
	   submitCanvas.drawImage(c, 0,0, 800, 600);
	}
}

function submitPhoto(){
    if(window.prompt("You sure you want to submit?")){
        ws.send(submitCanvas.toDataURL("image/webp"));
    }
}

function populateImages(e){
    if(typeof(e.data) == "string"){
        e.data = JSON.parse(e.data);
    }
    if(e.data.id == "results"){
        ws.removeEventListener("message", populateImages, false);
        ws.addEventListener("message", viewResult, false);
        viewResult(e);
    }else{
        document.getElementsByClassName("active")[0].style.animation = "moveOut 1s linear 0s 1";
        setTimeout(function(){document.getElementsByClassName("active")[0].classList.remove("active")}, 1000);
        document.getElementById("vote").parentElement.classList.add("active");
        document.getElementById("vote").parentElement.style.animation = "moveIn 1s linear 0s 1";
        
        document.getElementById("vote").getElementsByTagName('h2').innerText = document.getElementById("prompt").getElementsByTagName("h2").innerText;
        document.getElementById("vote").getElementsByTagName("h3").innerText = Math.floor(new Date(e.data.voteEnd) - new Date(e.data.voteStart) / 60000) + ((new Date(e.data.voteEnd) - new Date(e.data.voteStart) % 60000) / 1000).toFixed(0);
        let interval = setInterval(function(){
            if(new Date() >= new Date(e.data.roundStart)){
                document.getElementById("vote").getElementsByTagName("h3").innerText = Math.floor(new Date(e.data.voteEnd) - new Date() / 60000) + ((new Date(e.data.voteEnd) - new Date() % 60000) / 1000).toFixed(0);
            }
            else if(new Date() >= new Date(e.data.roundEnd)){
                document.getElementById("vote").getElementsByTagName("h3").innerText = "00:00";
                clearInterval(interval);
            }
        }, 1000);
        let ul = document.getElementById("vote").getElementsByTagName('ul');
        ul.innerHTML = "";
        for(i of e.data.images){
            ul.innerHTML += "<li><p style='width: 0px; overflow: visible; display: inline-block;'></p><img src='"+i+"' onclick='clickImage(event);' style='max-width: -webkit-fill-available;'></li>";
            ul.children.reverse()[0].children[0].addEventListener();
        }
    }
}
function clickImage(e){
    if(voteOrder.includes(e.target)){
        voteOrder.remove(e.target);
    }
    voteOrder[voteOrder.length] = e.target;
    for(i in voteOrder){
        voteOrder[i].style.border = "solid 2px #000a";
        voteOrder[i].parentElement.getElementsbyTagName('p').innerText = i+1;
    }
}

function submitVotes(){
    if(voteOrder.length == document.getElementById("vote").getElementsByTagName("ul")[0].children.length){
        if(window.prompt("Sure you wanna submit votes?")){
            ws.send(voteOrder.map(i => i.src).toJson());
        }
    }else{
        window.alert("You must put all your votes in order.");
    }
}

function viewResult(e){
    if(typeof(e.data) == "string"){
        e.data = JSON.parse(e.data);
    }
    if(e.data.id == "round"){
        ws.removeEventListener("message", viewResult, false);
        ws.addEventListener("message", newRound, false);
        newRound(e);
    }else{
        document.getElementsByClassName("active")[0].style.animation = "moveOut 1s linear 0s 1";
        setTimeout(function(){document.getElementsByClassName("active")[0].classList.remove("active")}, 1000);
        document.getElementById("results"+owner?"Owner":"").parentElement.classList.add("active");
        document.getElementById("results"+owner?"Owner":"").parentElement.style.animation = "moveIn 1s linear 0s 1";
        
        document.getElementById("results"+owner?"Owner":"").getElementsByTagName('h2').innerText = document.getElementById("prompt").getElementsByTagName("h2").innerText;
        document.getElementById("results"+owner?"Owner":"").getElementsByTagName('img').src = e.data.winningImage;
        document.getElementById("results"+owner?"Owner":"").getElementsByTagName('h3').innerText = e.data.winner;
    }
}
function gameOver(e){
    document.getElementsByClassName("active")[0].style.animation = "moveOut 1s linear 0s 1";
    setTimeout(function(){document.getElementsByClassName("active")[0].classList.remove("active")}, 1000);
    document.getElementById("gameEnd").parentElement.classList.add("active");
    document.getElementById("gameEnd").parentElement.style.animation = "moveIn 1s linear 0s 1";
    document.getElementById("gameEnd").getElementsByTagName('h2').innerText = "Winner: " + e.data.winner;
    
}