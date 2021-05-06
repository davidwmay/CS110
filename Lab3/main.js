// specify a url, in this case our web server

const url = "http://ec2-54-219-224-129.us-west-1.compute.amazonaws.com:2000/feed/random?q=weather"

var tweetList = [];

function fetchTweets() {
    if (!(document.getElementById("pause").checked)) {
        fetch(url)
        .then(res => res.json()) .then(data => {  
        // do something with data
        // console.log(data)
        OUTER:
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < tweetList.length; j++) {
                if (tweetList[j].includes(data.statuses[i].id)) {
                    // console.log(data.statuses[i].id)
                    continue OUTER;
                }
            }
            var tweetInfo = [];
            tweetInfo.push(data.statuses[i].id);
            tweetInfo.push(data.statuses[i].text);
            tweetInfo.push(data.statuses[i].created_at);
            tweetList.push(tweetInfo);
        }
        console.log(tweetList);
        })
        .catch(err => {
            // error catching
        console.log(err) }) 
    }
}

let searchString = "" // here we use a global variable

const handleSearch = event => {
    searchString = event.target.value.trim().toLowerCase()
    // you may want to update the displayed HTML here too

}
document.getElementById("searchBar").addEventListener("input", handleSearch)

function getTweets() {
    fetchTweets();
    var intervalID = setInterval(fetchTweets, 5000);
}
