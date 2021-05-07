// specify a url, in this case our web server
const url = "http://ec2-54-219-224-129.us-west-1.compute.amazonaws.com:2000/feed/random?q=weather"
let tweetContainer;
let tweet_list = [];
let search;
let searchTerm = "";


function fetchTweets() {
    if (!(document.getElementById("pause").checked)) {
        fetch(url)
        .then(res => res.json()) .then(data => {  
        // do something with data
        // console.log(data)
        OUTER:
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < tweet_list.length; j++) {
                if (tweet_list[j].includes(data.statuses[i].id)) {
                    // console.log(data.statuses[i].id)
                    continue OUTER;
                }
            }
            var tweetInfo = [];
            tweetInfo.push(data.statuses[i].id);
            tweetInfo.push(data.statuses[i].text);
            tweetInfo.push(data.statuses[i].created_at);
            tweetInfo.push(data.statuses[i].user.name);
            tweetInfo.push(data.statuses[i].user.profile_image_url_https);
            tweet_list.push(tweetInfo);
            // console.log(tweet_list)
        }
        refreshTweets(tweet_list);
        })
        .catch(err => {
            // error catching
        console.log(err) }) 
    }
}


function getTweets() {
    tweetContainer = document.getElementById('tweet-container');
    search = document.getElementById('searchBar').addEventListener("input", handleSearch);
    // console.log(search);
    fetchTweets();
    var intervalID = setInterval(fetchTweets, 5000);
}

const handleSearch = event => {
    searchString = event.target.value.trim().toLowerCase()
    searchTerm = searchString;
    // you may want to update the displayed HTML here too
    // console.log(searchString);
}

/**
 * Removes all existing tweets from tweetList and then append all tweets back in
 *
 * @param {Array<Object>} tweets - A list of tweets
 * @returns None, the tweets will be renewed
 */
function refreshTweets(tweets) {
    // console.log(tweets);
    // feel free to use a more complicated heuristics like in-place-patch, for simplicity, we will clear all tweets and append all tweets back
    // {@link https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript}
    while (tweetContainer.firstChild) {
        tweetContainer.removeChild(tweetContainer.firstChild);
    }

    // create an unordered list to hold the tweets
    // {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement}
    const tweetList = document.createElement("ul");
    // console.log(tweetList);
    // append the tweetList to the tweetContainer
    // {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild}
    tweetContainer.appendChild(tweetList);

    // all tweet objects (no duplicates) stored in tweets variable

    // filter on search text
    // {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter}
    // const filteredResult = tweets.filter(filterResult);
    // sort by date
    // {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort}
    // console.log(tweets);
    const sortedResult = tweets.sort();

    // execute the arrow function for each tweet
    // {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach}
    sortedResult.forEach(tweetObject => {
        if (searchTerm != "" && !tweetObject[1].includes(searchTerm)) {
            return;
        }
        // // create a container for individual tweet
        const tweet = document.createElement("li");

        // // e.g. create a div holding tweet content
        const tweetContent = document.createElement("div");
        // // create a text node "safely" with HTML characters escaped
        // // {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/createTextNode}
        const tweetText = document.createTextNode(tweetObject[1]);
        // FIXME: can't output newline
        const tweetName = document.createTextNode(tweetObject[3] + "\n");
        let profilePic = document.createElement("img");
        profilePic.src = tweetObject[4]
        // // append the text node to the div
        tweetContent.appendChild(tweetName);
        tweetContent.appendChild(profilePic);
        tweetContent.appendChild(tweetText);

        // // you may want to put more stuff here like time, username...
        tweet.appendChild(tweetContent);

        // // finally append your tweet into the tweet list
        tweetList.appendChild(tweet);
    });
    // console.log(searchTerm);
}