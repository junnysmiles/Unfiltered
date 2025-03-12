const express = require("express");
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: false}))

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

app.use(express.static(__dirname + "/public"));

app.get('/', async function(req, res) {
    const postsArray = await Model.getAllPosts()

    postsArray.forEach(post => {
      post.timestamp = formatTimestamp(post.timestamp)
      post.hashtags = post.hashtags.split(",").map(tag => `#${tag}`).join(" ");
    })

    res.render("home/home", {posts: postsArray});
});

app.get('/the-purpose', function(req, res) {
  res.render("purpose/purpose", {});
})

app.get('/vent', async function(req, res) {
  res.render("vent/vent", {});
})

app.post('/addpost', async function (req, res) {
  console.log(req.body)
  console.log(req.body.post)
  console.log(req.body.hashtags)

  const post = req.query.post;
  const hashtags = req.query.hashtags;

  let errors = [];
  let errorMessage = '';

  // Validate inputs
  if (!post || post.trim() === '') {
      errors.push('Please enter your diary entry.');
  }
  if (!hashtags || hashtags.trim() === '') {
      errors.push('Please enter at least 1 hashtag.');
  } 

  if (errors.length > 0) {
    errorMessage = errors.join('<br>');
    res.render("vent/vent", { 
      post: post, 
      hashtags: hashtags,
      errorMessage: errorMessage 
    });
  } else{
    // Generate timestamp
    let currentdate = new Date();
    let datetime = addZero(currentdate.getFullYear()) + "-" +
        addZero(currentdate.getMonth() + 1) + "-" +
        addZero(currentdate.getDate()) + " " +
        addZero(currentdate.getHours()) + ":" +
        addZero(currentdate.getMinutes()) + ":" +
        addZero(currentdate.getSeconds());

    await Model.createPost(post, hashtags, datetime);

    const postsArray = await Model.getAllPosts();
    postsArray.forEach(post => {
      post.timestamp = formatTimestamp(post.timestamp);
      post.hashtags = post.hashtags.split(",").map(tag => `#${tag}`).join(" ");
    });
  
    res.render("home/home", { posts: postsArray });
  }
})

app.get('/contact-us', function(req, res) {
  res.render("contact-us/contact-us", {})
})

app.get('/disclaimer', function(req, res) {
  res.render("disclaimer/disclaimer", {})
})

app.post("/like/:id", async function(req, res) {
  await Model.incrementLikes(req.params.id)
  console.log(postsArray.id, postsArray.likes)
  const likes = await Model.getLikes(req.params.id)
  const postsArray = await Model.getAllPosts()
  res.render("home/home", {posts: postsArray, likes: likes});
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


function addZero(str)
{
    return str < 10 ? ('0' + str) : str;
}

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