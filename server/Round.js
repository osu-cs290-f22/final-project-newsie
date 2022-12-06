const User = require("./User");
const fs = require('fs');

class Round {
    constructor(players) {
        this.players = players;
        this.submissions = [];
        this.votes = [];
        this.submissionComplete = false;
        this.votingComplete = false;
        this.headline = this.randomHeadline();
    }

    getHeadline() {
        return this.headline;
    }

    randomHeadline() {
        const data = fs.readFileSync("./headlines.txt");
        const lines = data.toString().split("\n");
        var headline = lines[Math.floor(Math.random() * lines.length)];
        return headline
    }

    submitImage(user, json) {
        if(this.submissionComplete) return;

        this.submissions.push({
            user: user,
            image: json.image,
            votes: 0
        })
    }

    setSubmissionComplete(bool){
        this.submissionComplete = bool;
    }

    isSubmissionComplete() {
        this.submissionComplete = this.submissionComplete || (this.submissions.length == this.players)
        return this.submissionComplete;
    }

    getSubmissions() {
        return this.submissions;
    }

    submitVotes(user, json) {
        if(this.votingComplete) return;

        this.votes.push({
            user: user,
            votes: json.votes
        });
    }

    isVotingComplete() {
        this.votingComplete = this.votingComplete || (this.votes.length == this.players);
        return this.votingComplete;
    }

    setVotingComplete(bool) {
        this.votingComplete = bool;
    }

    tallyVotes() {
        for(let voteSet of this.votes) {
            let userVotes = voteSet.votes;
            console.log("userVOtes: " + userVotes);
            for(let i in userVotes) {
            	console.log("i: " + userVotes[i]);
                this.submissions[userVotes[i]].votes += userVotes.length - i;
            }
        }
    }

    getTalliedVotes() {
        return this.submissions;
    }
    
    getWinningSubmission(){
    	let winner = {votes: -1};
    	for(let sub of this.submissions){
    		if(sub.votes > winner.votes){
    			winner = sub;
    		}
    	}
    	return winner;
    }
}

module.exports = Round;
