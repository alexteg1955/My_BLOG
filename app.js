//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const cors = require("cors");
const dotenv = require("dotenv");
const createError = require("http-errors");



const homeStartingContent = "Just because struggles come your way doesnt mean it can ruin your day. The good and the bad are a way of life i beg you dont get down move beyond the strife. We must live life, taking things in stride helping each other, stoping any divide Life is better when we support and love And that is whats expected from above..";
const aboutContent = "It is the thesis of the great psychoanalyst Viktor Frankl that man can endure any hardship as long as he can find meaning in the experience. Incidentally, as a survivor of Nazi Concentration Camps he was in a position to know. Thankfully, most of us are not tested in such extreme conditions. However, the principle is the same. Human beings cannot live without meaning. Depression is the natural outcome of living a life that is bereft of purpose..";
const contactContent = "A short poem may be a stylistic choice or it may be that you have said what you intended to say in a more concise way. Either way, they differ stylistically from a long poem in that there tends to be more care in word choice. Since there are fewer words people tend to spend more time on choosing a word that fits the subject to perfection. Because of this meticulous attitude, writing a short poem is often more tedious than writing a long poem.";

const app = express();

// View engine setup
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(express.json())         //with this we just intiallize "body-parser in our sever"
app.use(cors())



//connecting our app.js with mongoDB Server i.e configuring the dotenv file.
dotenv.config()

//using the dotenv pacakge to access out databse, i.e this is our Mongoose Schema
mongoose.connect(process.env.database_access, () => console.log("Database is connected successfully"), {useNewUrlParser: true}, {useUnifiedTopology: true,});

const postSchema = {
  title: String,
  content: String
};

//this is our mongoose model based on our schema
const Post = mongoose.model("Post", postSchema);

//LANDING HOME PAGE 
app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

//LANDING PAGE FOR COMPOSE
app.get("/compose", function(req, res){
  res.render("compose");
});


//SENDING A POST REQUEST TO OUR COMPOSE PAGE TO THE SERVER
app.post("/compose", function(req, res){
  const post = new Post({     //  <= this is a javscript object recieving the typed object by the user
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){      //this post.save(post) is to make sure every new post is saved to database
    if (!err){
        res.redirect("/");    // the res.direct("/") is ti take us back to the our main root page.
    }
  });
});


//LANDING PAGE FOR EVERY NEW CREATED POST WITH A POST ID
app.get("/posts/:postId", function(req, res){     //this is just to add as many route to our main route.. using the (req.params)

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

//LANDING PAGE FOR ABOUT-US
app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

//LANDING PAGE FOR CONTACT-US
app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
