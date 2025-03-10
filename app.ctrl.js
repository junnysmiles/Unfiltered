const express = require('express');
const app = express();

const Model = require("./app.model.js")

async function startup()
{
  await Model.makeConnection()
}
startup()

const mustacheExpress = require("mustache-express");

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views")

app.get('/', async function(req, res) {
    const postsArray = await Model.getAllPosts()
    const hashtagsArray = await Model.getHashtags()

    postsArray.forEach(post => {
      post.timestamp = formatTimestamp(post.timestamp)
    })

    hashtagsArray.forEach(hashtags => {
      hashtags.hashtags = hashtags.hashtags ? hashtags.hashtags.split(",") : [];
    })

    console.log(hashtagsArray)

    res.render("home/home", {posts: postsArray, hashtags: hashtagsArray});
});

app.get('/the-purpose', function(req, res) {
  res.render("purpose/purpose", {});
})

app.get('/vent', function(req, res) {
  res.render("vent/vent", {})
})

app.get('/contact-us', function(req, res) {
  res.render("contact-us/contact-us", {})
})

app.get('/disclaimer', function(req, res) {
  res.render("disclaimer/disclaimer", {})
})

app.post("/like/:id", (req, res) => {
  db.run("UPDATE Posts SET likes = likes + 1 WHERE ID = ?", [req.params.id], err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
  });
});

// Send back a static file
// Use a regular expression to detect "any other route"
// Define the route last such that other routes would
// be detected and handled as such first.
app.get(/^(.+)$/, function(req,res){
    console.log("static file request: " + req.params[0]);
    res.sendFile(__dirname + req.params[0]);
  });
  
  var server = app.listen(3000, function()
  {
    console.log("App listening....");
  });
  
  
// Format TimeStamp from SQL -> February 12, 2024 @ 10:34am
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);

  // Define arrays for months and days
  const months = [
      "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
  ];
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
    
  // Convert hour to 12-hour format
  const formattedHour = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

  // Format date and time
  const formattedDate = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} @ ${formattedHour}:${formattedMinutes}${ampm}`;

  return formattedDate;
}