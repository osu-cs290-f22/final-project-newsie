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
        return lines[Math.floor(Math.random() * lines.length)];
    }

    submitImage(user, json) {
        if(this.submissionComplete)

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
        for(voteSet in this.votes) {
            userVotes = voteSet.votes;
            for(var i = 0; i < userVotes.length; i++) {
                submissions[userVotes[i]].votes += userVotes.length - i;
            }
        }
    }

    getTalliedVotes() {
        return this.submissions;
    }
}

module.exports = Round;