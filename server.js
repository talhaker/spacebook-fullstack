var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const SERVER_PORT = 8080;

mongoose.connect('mongodb://localhost/spacebookDB', function() {
    console.log("DB connection established!!!");
})

var Post = require('./models/postModel');

var app = express();
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Dummy data to populate the database

/*
let post1 = new Post({
    text: "hello",
    comments: [{
        text: "hi there",
        user: "me"
    }]
});

let post2 = new Post({
    text: "this is boring...",
    comments: [{
            text: "indeed it is",
            user: "me"
        },
        {
            text: "it's actually quite interesting",
            user: "she"
        }
    ]
});

let post3 = new Post({
    text: "hello everyone!",
    comments: []
});

let post4 = new Post({
    text: "I said hello! anybody there?",
    comments: [{
            text: "I'm here",
            user: "us"
        },
        {
            text: "so am I",
            user: "she"
        },
        {
            text: "I'm not",
            user: "you"
        }
    ]
});

post1.save();
post2.save();
post3.save();
post4.save();

*/


// You will need to create 5 server routes
// These will define your API:

// 1) to handle getting all posts and their comments
app.get('/posts', function(request, response, next) {
    Post.find({}).select('text comments').exec(function(err, posts) {
        if (err) {
            console.log(err);
        } else {
            response.send(posts);
        }
    });
});


// 2) to handle adding a post
app.post('/posts', function(request, response, next) {
    let newPost = {
        text: request.body.text,
        comments: []
    }

    let post = new Post(newPost);
    post.save();
    newPost._id = post._id;
    response.send(newPost);
});


// 3) to handle deleting a post
app.delete('/posts/:postId', function(request, response, next) {
    Post.findByIdAndRemove(postId, function(postId) {
        response.send(postId);
    });
});


// 4) to handle adding a comment to a post
// 5) to handle deleting a comment from a post

app.listen(SERVER_PORT, () => {
    console.log("Server started on port " + SERVER_PORT);
});