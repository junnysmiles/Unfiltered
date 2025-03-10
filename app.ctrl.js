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
    console.log(__dirname)
    const postsArray = await Model.getAllPosts()

    console.log(postsArray)

    res.render("home/home", {posts: postsArray});
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
  