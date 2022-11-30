const WSaddr = "wss://localhost:3001";
const HTaddr = "https://localhost:3001/";
let firstWrong, gameCode, nickName, ws;

document.addEventListener("load", function(){
	let xhp = new XMLHttpRequest();
	xhp.onreadystatechange = function(){
		document.getElementById("subtitle").innerHTML = xhp.responseText || "This code is full of errors! :)";
	}
	xhp.open("get", HTaddr+"subtitle", true);
	xhp.send();
});
function backToCode(from){
	firstWrong = undefined;
	from.style.animation = "moveOut 1.5s linear 0s 1";
	setTimeout(function(){from.classList.remove("active")}, 1500);
	document.getElementById("code").classList.add("active");
	document.getElementById("code").style.animation = "moveIn 1.5s linear 0s 1";
}
function goToNewGame(){
	firstWrong = undefined;
	document.getElementById("code").style.animation = "moveOut 1.5s linear 0s 1";
	setTimeout(function(){document.getElementById("code").classList.remove("active")}, 1500);
	document.getElementById("createGame").classList.add("active");
	document.getElementById("createGame").style.animation = "moveIn 1.5s linear 0s 1";
}

function createGame(name){
	if(name.length === 0){
		firstWrong = firstWrong || document.timeline.currentTime/1000;
		document.getElementById("createGame").style.animation = "wrong .2s linear "+(document.timeline.currentTime/1000 - firstWrong)+"s 2";
	}else{
		document.getElementById("createGame").style.animation = "think 1s cubic-bezier(0.5, 0, 0.5, 1) 0s infinite";
		let xhp = new XMLHttpRequest();
		xhp.onreadystatechange = function(){
			if(this.readyState == 4 && this.status == 201){ // 201 is Created Something (game object)
				firstWrong = undefined;
				gameCode = xhp.responseText;
				nickName = name;
				document.getElementById("createGame").style.animation = "moveOut 1.5s linear 0s 1";
				setTimeout(function(){document.getElementById("createGame").classList.remove("active")}, 1500);
				document.getElementById("lobbyMaster").classList.add("active");
				document.getElementById("lobbyMaster").style.animation = "moveIn 1.5s linear 0s 1";
				ws = new WebSocket(WSaddr);
				ws.onopen = function(e) {
					ws.send(gameCode+nickName);
				}
			}else{
				firstWrong = firstWrong || document.timeline.currentTime/1000;
				document.getElementById("createGame").style.animation = "wrong .2s linear "+(document.timeline.currentTime/1000 - firstWrong)+"s 2";
			}
		};
		xhp.open("POST", HTaddr+"?name="+encodeURIComponent(nickName), true);
		xhp.send();
	}
}

function submitCode(code){
	if(code.length == 6 && code.match(/^([0-9]|[a-z])+([0-9a-z]+)$/i)){
		document.getElementById("code").style.animation = "think 1s cubic-bezier(0.5, 0, 0.5, 1) 0s infinite";
		let xhp = new XMLHttpRequest();
		xhp.onreadystatechange = function(){
			if(this.readyState == 4 && this.status == 204){ //204 is No Content
				firstWrong = undefined;
				gameCode = code;
				document.getElementById("code").style.animation = "moveOut 1.5s linear 0s 1";
				setTimeout(function(){document.getElementById("code").classList.remove("active")}, 1500);
				document.getElementById("nickname").classList.add("active");
				document.getElementById("nickname").style.animation = "moveIn 1.5s linear 0s 1";
			}else{
				firstWrong = firstWrong || document.timeline.currentTime/1000;
				document.getElementById("code").style.animation = "wrong .2s linear "+(document.timeline.currentTime/1000 - firstWrong)+"s 2";
			}
		};
		xhp.open("GET", HTaddr+"?code="+code, true);
		xhp.send();
	}else{
		firstWrong = firstWrong || document.timeline.currentTime/1000;
		document.getElementById("code").style.animation = "wrong .2s linear "+(document.timeline.currentTime/1000 - firstWrong)+"s 2";
	}
}

function submitName(name){
	if(name.length === 0){
		firstWrong = firstWrong || document.timeline.currentTime/1000;
		document.getElementById("nickname").style.animation = "wrong .2s linear "+(document.timeline.currentTime/1000 - firstWrong)+"s 2";
	}else{
		document.getElementById("nickname").style.animation = "think 1s cubic-bezier(0.5, 0, 0.5, 1) 0s infinite";
		let xhp = new XMLHttpRequest();
		xhp.onreadystatechange = function(){
			if(this.readyState == 4 && this.status == 201){ // 201 is Created Something (user object)
				firstWrong = undefined;
				nickName = name;
				document.getElementById("nickname").style.animation = "moveOut 1.5s linear 0s 1";
				setTimeout(function(){document.getElementById("nickname").classList.remove("active")}, 1500);
				document.getElementById("lobby").classList.add("active");
				document.getElementById("lobby").style.animation = "moveIn 1.5s linear 0s 1";
				ws = new WebSocket(WSaddr);
				ws.onopen = function(e) {
					ws.send(gameCode+nickName);
				}
			}else{
				firstWrong = firstWrong || document.timeline.currentTime/1000;
				document.getElementById("nickname").style.animation = "wrong .2s linear "+(document.timeline.currentTime/1000 - firstWrong)+"s 2";
			}
		};
		xhp.open("POST", HTaddr+"?code="+gameCode+"&name="+encodeURIComponent(nickName), true);
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
