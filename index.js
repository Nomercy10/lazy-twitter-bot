console.log("Starting the Bot..");
const config = require("./config")
const Twit  = require("twit");
const axios = require('axios');

// Create new twit instance
const T = new Twit(config)


// Post a joke daily
postStatusUpdate()
setTimeout(postStatusUpdate, 86400000)
async function postStatusUpdate() {
	const joke = await axios.get("https://icanhazdadjoke.com/", {headers: {'Accept': 'application/json'}}).then(res => {
		return res.data.joke
	});
	if(joke) {
		T.post('statuses/update',{status: joke}, responseCallback)
	}
	
}

// Stream on favorite tweets, hastags and retweet them
likeAndReTweet()
setTimeout(likeAndReTweet, 1000*60*60);

function likeAndReTweet() {
	const filterStream = T.stream('statuses/filter', { track: ['#JavaScript', '#nodejs', "#mongoDB", "#vuejs", "#reactjs", "#expressjs"]})
	filterStream.on('tweet', function(tweet) {
		// Like the tweets..
		T.post('favorites/create', {id: tweet.id_str}, responseCallback)

		// Retweet
		T.post('statuses/retweet/:id', {id: tweet.id_str},responseCallback)
	})
}


function responseCallback(err) {
	if(err) console.log("error:", err)
}
