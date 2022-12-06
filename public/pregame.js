const WSaddr = "ws://localhost:3001";
const HTaddr = "localhost:3001/";
let firstWrong, gameCode, nickName, ws, owner;

let xhp = new XMLHttpRequest();
xhp.onreadystatechange = function(){
	document.getElementById("subtitle").innerText = xhp.responseText || "This code is full of errors! :)";
}
xhp.open("get", HTaddr+"subtitle", true);
xhp.send();

function backToCode(from){
	firstWrong = undefined;
	from.parentElement.style.animation = "moveOut 1s linear 0s 1";
	setTimeout(function(){from.parentElement.classList.remove("active")}, 1000);
	document.getElementById("code").parentElement.classList.add("active");
	document.getElementById("code").parentElement.style.animation = "moveIn 1s linear 0s 1";
}
function goToNewGame(){
	firstWrong = undefined;
	document.getElementById("code").parentElement.style.animation = "moveOut 1s linear 0s 1";
	setTimeout(function(){document.getElementById("code").parentElement.classList.remove("active")}, 1000);
	document.getElementById("createGame").parentElement.classList.add("active");
	document.getElementById("createGame").parentElement.style.animation = "moveIn 1s linear 0s 1";
}

function createGame(name){
	if(name.length === 0){
		firstWrong = firstWrong || document.timeline.currentTime/1000;
		document.getElementById("createGame").parentElement.style.animation = "wrong .2s linear "+(document.timeline.currentTime/1000 - firstWrong)+"s 2";
	}else{
		document.getElementById("createGame").parentElement.style.animation = "think 1s cubic-bezier(0.5, 0, 0.5, 1) 0s infinite";
		let xhp = new XMLHttpRequest();
		xhp.onreadystatechange = function(){
			if(this.readyState == 4 && this.status == 201){ // 201 is Created Something (game object)
				firstWrong = undefined;
				gameCode = xhp.responseText;
				nickName = name;
				document.getElementById("createGame").parentElement.style.animation = "moveOut 1s linear 0s 1";
				setTimeout(function(){document.getElementById("createGame").parentElement.classList.remove("active")}, 1000);
				document.getElementById("lobbyMaster").parentElement.classList.add("active");
				document.getElementById("lobbyMaster").parentElement.style.animation = "moveIn 1s linear 0s 1";
				document.getElementById("lobbyMaster").children[0].innerText= "Code: "+ gameCode;
				ws = new WebSocket(WSaddr);
				ws.onopen = function(e) {
					ws.send(gameCode+nickName);
				}
				ws.onerror = function(e){
					console.error("WebSocket ERROR: "+e)
					window.alert("Error connecting to server.");
				}
       	 		ws.addEventListener("message", handleWS, false);
				owner = true;
			}else{
				firstWrong = firstWrong || document.timeline.currentTime/1000;
				document.getElementById("createGame").parentElement.style.animation = "wrong .2s linear "+(document.timeline.currentTime/1000 - firstWrong)+"s 2";
			}
		};
		xhp.open("POST", HTaddr+"?name="+encodeURIComponent(name), true);
		xhp.send();
	}
}

function submitCode(code){
	if(code.length == 6 && code.match(/^([0-9]|[A-Z])+([0-9A-Z]+)$/i)){
		document.getElementById("code").parentElement.style.animation = "think 1s cubic-bezier(0.5, 0, 0.5, 1) 0s infinite";
		let xhp = new XMLHttpRequest();
		xhp.onreadystatechange = function(){
			if(this.readyState == 4 && this.status == 204){ //204 is No Content
				firstWrong = undefined;
				gameCode = code;
				document.getElementById("code").parentElement.style.animation = "moveOut 1s linear 0s 1";
				setTimeout(function(){document.getElementById("code").parentElement.classList.remove("active")}, 1000);
				document.getElementById("nickname").parentElement.classList.add("active");
				document.getElementById("nickname").parentElement.style.animation = "moveIn 1s linear 0s 1";
			}else{
				console.log(this.readyState + " , " +this.status);
				console.log(this.responseText);
				firstWrong = firstWrong || document.timeline.currentTime/1000;
				document.getElementById("code").parentElement.style.animation = "wrong .2s linear "+(document.timeline.currentTime/1000 - firstWrong)+"s 2";
			}
		};
		xhp.open("GET", HTaddr+"?game="+code, true);
		xhp.send();
	}else{
		firstWrong = firstWrong || document.timeline.currentTime/1000;
		document.getElementById("code").parentElement.style.animation = "wrong .2s linear "+(document.timeline.currentTime/1000 - firstWrong)+"s 2";
	}
}

function submitName(name){
	if(name.length === 0 || name.length > 16){
		firstWrong = firstWrong || document.timeline.currentTime/1000;
		document.getElementById("nickname").parentElement.style.animation = "wrong .2s linear "+(document.timeline.currentTime/1000 - firstWrong)+"s 2";
	}else{
		document.getElementById("nickname").parentElement.style.animation = "think 1s cubic-bezier(0.5, 0, 0.5, 1) 0s infinite";
		let xhp = new XMLHttpRequest();
		xhp.onreadystatechange = function(){
			if(this.readyState == 4 && this.status == 201){ // 201 is Created Something (user object)
				firstWrong = undefined;
				nickName = name;
				document.getElementById("nickname").parentElement.style.animation = "moveOut 1s linear 0s 1";
				setTimeout(function(){document.getElementById("nickname").parentElement.classList.remove("active")}, 1000);
				document.getElementById("lobby").parentElement.classList.add("active");
				document.getElementById("lobby").parentElement.style.animation = "moveIn 1s linear 0s 1";
				ws = new WebSocket(WSaddr);
				ws.onopen = function(e) {
					ws.send(gameCode+nickName);
				}
				ws.addEventListener("message", handleWS, true);
			}else{
				firstWrong = firstWrong || document.timeline.currentTime/1000;
				document.getElementById("nickname").parentElement.style.animation = "wrong .2s linear "+(document.timeline.currentTime/1000 - firstWrong)+"s 2";
			}
		};
		xhp.open("POST", HTaddr+"?game="+gameCode+"&name="+encodeURIComponent(name), true);
		xhp.send();
	}
}
function manageCodeInput(event){
	if(event.charCode == 13){
		procede(event.target.parentElement);
	}
	else{
		return (event.charCode > 64 && event.charCode < 91)
		|| (event.charCode > 47 && event.charCode < 58)
		|| (event.charCode > 96 && event.charCode < 123);
	}
}
