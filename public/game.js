let submitCanvas = document.createElement('canvas');
submitCanvas.width = 800;
submitCanvas.height = 600;
let voteOrder = [];
let voteInterval;
let submitInterval;

function handleWS(e){
	let data = e.data;
    if(typeof(data) == "string"){
        data = JSON.parse(data);
        if(typeof(data) == "string"){
		    data = JSON.parse(data);
        	console.log(data);
		}
    }
    console.log(data);
    switch(data.id){
    	case "lobby":
    		updateUserList(data);
    		break;
    	case "round":
    		newRound(data);
    		break;
    	case "images":
    		populateImages(data);
    		break;
    	case "results":
    		viewResult(data);
    		break;
    	case "end":
    		gameOver(data);
    		break;
    }
}

function updateUserList(d){
    let ul = document.getElementById("lobby"+(owner?"Master":"")).getElementsByTagName('ul')[0];
    ul.innerHTML = "";
    for(i of d.usernames){
        ul.innerHTML += "<li>"+i+"</li>";
    }
}
function newRound(d){
    document.getElementsByClassName("active")[0].style.animation = "moveOut 1s linear 0s 1";
    setTimeout(function(e){e.classList.remove("active")}(document.getElementsByClassName("active")[0]), 1000);
    document.getElementById("prompt").parentElement.classList.add("active");
    document.getElementById("prompt").parentElement.style.animation = "moveIn 1s linear 0s 1";
    
    document.getElementById("prompt").getElementsByTagName("h2")[0].innerText = "\"" + d.headline + "\"";
    document.getElementById("prompt").getElementsByTagName("h3")[0].innerText = Math.floor((d.roundEnd - d.roundStart)/ 60000) + ":" + (Math.floor(((d.roundEnd - d.roundStart)% 60000) / 1000) + "").padStart(2,'0');
    submitInterval = setInterval(function(d){
        if(new Date() >= new Date(d.roundStart)){
            document.getElementById("prompt").getElementsByTagName("h3")[0].innerText = Math.floor((d.roundEnd - new Date())/60000) + ":" + (Math.floor(((d.roundEnd - new Date()) % 60000) / 1000) + "").padStart(2,'0');
        }
        else if(new Date() >= new Date(d.roundEnd)){
            document.getElementById("prompt").getElementsByTagName("h3")[0].innerText = "00:00";
            clearInterval(submitInterval);
        }
    }(d), 1000);
}
function newFile(file){
    let img = new Image();
    try{
        img.src = URL.createObjectURL(new Blob([file],{type: file.type}));
    }catch(e){
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
	   document.getElementById('prompt').getElementsByTagName('canvas')[0].getContext("2d").clearRect(0,0,document.getElementById('prompt').getElementsByTagName('canvas')[0].width, document.getElementById('prompt').getElementsByTagName('canvas')[0].height);
	   document.getElementById('prompt').getElementsByTagName('canvas')[0].getContext("2d").drawImage(c, 0,0, document.getElementById('prompt').getElementsByTagName('canvas')[0].width, document.getElementById('prompt').getElementsByTagName('canvas')[0].height);
	   submitCanvas.getContext("2d").clearRect(0,0, 800, 600);
	   submitCanvas.getContext("2d").drawImage(c, 0,0, 800, 600);
	}
}
let canvasBG = new Image();
canvasBG.src = 'outline.svg';
canvasBG.onload = function(){
    document.getElementById('prompt').getElementsByTagName('canvas')[0].getContext("2d").drawImage(canvasBG, 0, 0, document.getElementById('prompt').getElementsByTagName('canvas')[0].width, document.getElementById('prompt').getElementsByTagName('canvas')[0].height);
}
function submitPhoto(){
    if(window.confirm("You sure you want to submit?")){
        submitCanvas.toBlob((b) => {
            let reader = new FileReader();
            reader.readAsDataURL(b);
            reader.onloadend = function () {
                ws.send(JSON.stringify({"image": reader.result}));
            }
        }, "image/webp");
        submitCanvas.getContext("2d").clearRect(0,0, 800, 600);
        document.getElementById('prompt').getElementsByTagName('canvas')[0].getContext("2d").clearRect(0,0, document.getElementById('prompt').getElementsByTagName('canvas')[0].width, document.getElementById('prompt').getElementsByTagName('canvas')[0].height);
        document.getElementById('prompt').getElementsByTagName('canvas')[0].getContext("2d").drawImage(canvasBG, 0, 0, document.getElementById('prompt').getElementsByTagName('canvas')[0].width, document.getElementById('prompt').getElementsByTagName('canvas')[0].height);
    }
}

function populateImages(d){
    document.getElementsByClassName("active")[0].style.animation = "moveOut 1s linear 0s 1";
    setTimeout(function(e){e.classList.remove("active")}(document.getElementsByClassName("active")[0]), 1000);
    document.getElementById("vote").parentElement.classList.add("active");
    document.getElementById("vote").parentElement.style.animation = "moveIn 1s linear 0s 1";
    
    document.getElementById("vote").getElementsByTagName('h2')[0].innerText = document.getElementById("prompt").getElementsByTagName("h2")[0].innerText;
    document.getElementById("vote").getElementsByTagName("h3")[0].innerText = Math.floor((d.voteEnd - d.voteStart)/ 60000) + ":" + (Math.floor(((d.voteEnd - d.voteStart)% 60000) / 1000) + "").padStart(2,'0');
    voteInterval = setInterval(function(d){
        if(new Date() >= new Date(d.voteStart)){
            document.getElementById("vote").getElementsByTagName("h3")[0].innerText = Math.floor((d.voteEnd - new Date())/60000) + ":" + (Math.floor(((d.voteEnd - new Date()) % 60000) / 1000) + "").padStart(2,'0');
        }
        else if(new Date() >= new Date(d.roundEnd)){
            document.getElementById("vote").getElementsByTagName("h3")[0].innerText = "00:00";
            clearInterval(voteInterval);
        }
    }(d), 1000);
    let ul = document.getElementById("vote").getElementsByTagName('ul')[0];
    ul.innerHTML = ""
    recursiveLoading(ul, d.images, 0);
}
function recursiveLoading(ul, blobs, i){
    if(i >= blobs.length) return;
    fetch(blobs[i]).then(res => res.blob()).then(function(blob) {
        ul.innerHTML += "<li><p></p><img idx='"+(i-1)+"' src='"+ URL.createObjectURL(blob)+"' onclick='clickImage(event);'></li>";
    }).then(recursiveLoading(ul, blobs, ++i));
}
function clickImage(e){
    if(voteOrder.includes(e.target)){
        voteOrder = voteOrder.filter(function(n){return n != e.target;});
    }
    voteOrder[voteOrder.length] = e.target;
    for(i in voteOrder){
        voteOrder[i].style.border = "solid 2px #000a";
        voteOrder[i].parentElement.getElementsByTagName('p')[0].innerText = parseInt(i)+1;
    }
}

function submitVotes(){
    if(voteOrder.length == document.getElementById("vote").getElementsByTagName("ul")[0].children.length){
        if(window.confirm("Sure you wanna submit votes?")){
            ws.send(JSON.stringify({"votes": voteOrder.map(i => i.getAttribute("idx"))}));
            voteOrder = [];
        }
    }else{
        window.alert("You must put all your votes in order.");
    }
}

function viewResult(d){
    document.getElementsByClassName("active")[0].style.animation = "moveOut 1s linear 0s 1";
    setTimeout(function(e){e.classList.remove("active")}(document.getElementsByClassName("active")[0]), 1000);
    document.getElementById("results"+(owner?"Owner":"")).parentElement.classList.add("active");
    document.getElementById("results"+(owner?"Owner":"")).parentElement.style.animation = "moveIn 1s linear 0s 1";
    
    document.getElementById("results"+(owner?"Owner":"")).getElementsByTagName('h2')[0].innerText = document.getElementById("prompt").getElementsByTagName("h2")[0].innerText;
    fetch(d.winningImage).then(res => res.blob()).then(function(blob) {
    	document.getElementById("results"+(owner?"Owner":"")).getElementsByTagName('img')[0].src = URL.createObjectURL(blob);
    });
    document.getElementById("results"+(owner?"Owner":"")).getElementsByTagName('h3')[0].innerText = d.winner;
}
function gameOver(d){
    document.getElementsByClassName("active")[0].style.animation = "moveOut 1s linear 0s 1";
    setTimeout(function(){document.getElementsByClassName("active")[0].classList.remove("active")}, 1000);
    document.getElementById("gameEnd").parentElement.classList.add("active");
    document.getElementById("gameEnd").parentElement.style.animation = "moveIn 1s linear 0s 1";
    document.getElementById("gameEnd").getElementsByTagName('h2')[0].innerText = "Winner: " + d.winner;
}
