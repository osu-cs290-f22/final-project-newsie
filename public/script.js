let firstWrong;
let gameCode;
let nickName;
function procede(cont){
	switch(cont.id){
		case "code":
			if(cont.children[1].value.length == 6){
				let allGood = true;
				for(let i = 0; i < 6; i++){
					let cur = cont.children[1].value.charCodeAt(i);
					if(!((cur > 64 && cur < 91) || (cur > 47 && cur < 58) || (cur > 96 && cur < 123))){
						allGood = false;
					}
				}
				if(allGood){
					cont.style.animation = "think 1s cubic-bezier(0.5, 0, 0.5, 1) 0s infinite";
					firstWrong = undefined;
					//send code to database, search for matching game. await response. codeResponse(response, cont);
					return;
				}
			}
		break;
		case "nickname":
			cont.style.animation = "think 1s cubic-bezier(0.5, 0, 0.5, 1) 0s infinite";
			//send nickname to database.
			nickName = cont.children[1].value;
			cont.style.animation = "moveOut 1.5s linear 0s 1";
			//go to ready screen w/ list of players
	}
	
	if(firstWrong == undefined){firstWrong = document.timeline.currentTime/1000;}
	cont.style.animation = "wrong .2s linear "+(document.timeline.currentTime/1000 - firstWrong)+"s 2";
}
function codeResponse(valid, cont){
	if(valid){
		gameCode = cont.children[1].value;
		cont.style.animation = "moveOut 1.5s linear 0s 1";
		document.getElementById("password").classList.add("active");
		document.getElementById("password").style.animation = "moveIn 1s ease-out 0s 1";
		setTimeout(function(){cont.classList.remove("active");}, 1499);
	}
	else{
		if(firstWrong == undefined){firstWrong = document.timeline.currentTime/1000;}
		cont.style.animation = "wrong .2s linear "+(document.timeline.currentTime/1000 - firstWrong)+"s 2";
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
