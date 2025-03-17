const express = require("express");
const app = express();
const mustacheExpress = require("mustache-express");

const Model = require("./app.model.js")

async function startup()
{
  await Model.makeConnection()
}
startup()

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views")

app.use(express.json())
app.use(express.urlencoded({extended: false}))                
app.use(express.static(__dirname + "/public/js"));

app.get('/', async function(req, res) {
    const postsArray = await Model.getAllPosts()

    postsArray.forEach(post => {
      post.timestamp = formatTimestamp(post.timestamp)
      post.hashtags = post.hashtags.split(",").map(tag => `#${tag}`).join(" ");
    })

    res.render("home", {posts: postsArray});
});

app.get('/the-purpose', function(req, res) {
  res.render("purpose", {purposenav: true});
})

app.get('/vent', async function(req, res) {
  res.render("vent", {ventnav: true});
})

//-----------------------------------------------------------------------

// FIGURE IT OUT
app.post('/post-vent', async function(req, res) {
  console.log(req.body)
  console.log(req.body.post)
  console.log(req.body.hashtags)
  console.log(req.body.radiocheck)

  const post = req.body.post;
  const hashtags = req.body.hashtags;
  const terms = req.body.radiocheck;


  let errors = [];
  let errorMessage = '';
  let errorInput = false
  let postInput = false
  let hashtagsInput = false
  let radioError = '';

  // Validate inputs
  if (!post || post.trim() === '') {
    errors.push('Please enter your diary entry!');
    errorInput = true
    postInput = true
  }
  if (!hashtags || hashtags.trim() === '') {
    errors.push('Please enter at least 1 hashtag!');
    errorInput = true
    hashtagsInput = true
  } 
  // if (!terms || terms === undefined) {
  //   radioError = '<div id="radio-error-output" class="invalid-feedback">You must agree to the terms.</div>'
  //   res.render("vent", { 
  //     radioError: radioError
  //   })
  // }
  if (errorInput) {
    errorMessage = errors.join("<br>");

    res.render("vent", { 
      errorMessage: errorMessage,
      errorInput: errorInput,
      postInput: postInput,
      hashtagsInput: hashtagsInput,
      oldPost: post || "",
      oldHashtags: hashtags || ""
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

    const successMessage = "<div class='pb-2 pt-0'><div class='alert alert-success' role='alert'>Post Submitted Successfully!</div></div>"
  
    res.render("home", { posts: postsArray, successMessage: successMessage });
  }
})

//-----------------------------------------------------------------------

app.get('/contact-us', function(req, res) {
  res.render("contact-us", {})
})

app.get('/disclaimer', function(req, res) {
  res.render("disclaimer", {})
})


//-----------------------------------------------------------------------

// // More logic
// app.post('/addpost', async function (req, res) {
//   console.log(req.body)
//   console.log(req.body.post)
//   console.log(req.body.hashtags)

//   const post = req.query.post;
//   const hashtags = req.query.hashtags;

//   let errors = [];
//   let errorMessage = '';

//   // Validate inputs
//   if (!post || post.trim() === '') {
//       errors.push('Please enter your diary entry.');
//   }
//   if (!hashtags || hashtags.trim() === '') {
//       errors.push('Please enter at least 1 hashtag.');
//   } 

//   if (errors.length > 0) {
//     errorMessage = errors.join('<br>');
//     res.render("vent/vent", { 
//       errorMessage: errorMessage 
//     });
//   } else{
//     // Generate timestamp
//     let currentdate = new Date();
//     let datetime = addZero(currentdate.getFullYear()) + "-" +
//         addZero(currentdate.getMonth() + 1) + "-" +
//         addZero(currentdate.getDate()) + " " +
//         addZero(currentdate.getHours()) + ":" +
//         addZero(currentdate.getMinutes()) + ":" +
//         addZero(currentdate.getSeconds());

//     await Model.createPost(post, hashtags, datetime);

//     // const postsArray = await Model.getAllPosts();
//     // postsArray.forEach(post => {
//     //   post.timestamp = formatTimestamp(post.timestamp);
//     //   post.hashtags = post.hashtags.split(",").map(tag => `#${tag}`).join(" ");
//     // });
  
//     // res.render("home/home", { posts: postsArray });
//   }
// })


// FIGURE IT OUT
app.post("/like/:id", async function(req, res) {
  await Model.incrementLikes(req.params.id)
  console.log(postsArray.id, postsArray.likes)
  const likes = await Model.getLikes(req.params.id)
  const postsArray = await Model.getAllPosts()
  res.render("home", {posts: postsArray, likes: likes});
});


//-----------------------------------------------------------------------


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


// Format the zeros for timestamp
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