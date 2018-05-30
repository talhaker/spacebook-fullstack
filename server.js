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
app.get('/posts', (request, response, next) => {
    Post.find({}).select('text comments').exec(function(err, posts) {
        if (err) {
            console.log(err);
        } else {
            response.send(posts);
        }
    });
});


// 2) to handle adding a post
app.post('/posts', (request, response, next) => {
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
app.delete('/posts/:postId', (request, response, next) => {
    let postId = request.params.postId;
    Post.findByIdAndRemove(postId, (postId) => {
        response.send(postId);
    });
});


// 4) to handle adding a comment to a post
app.post('/posts/:postId/comments', (request, response, next) => {
    let newComment = {
        text: request.body.text,
        user: request.body.user
    }
    let postId = request.body.postId;

    Post.findByIdAndUpdate(postId, { $push: { comments: newComment } }, (err, post) => {
        if (!err) {
            newComment._id = post.comments[post.comments.length - 1]._id;
            response.send(newComment);
        }
    });
});


// 5) to handle deleting a comment from a post
app.delete('/posts/:postId/comments/:commentId', (request, response, next) => {
    let postId = request.params.postId;
    let commentId = request.params.commentId;
    Post.findByIdAndUpdate(postId, { $pull: { comments: { _id: [commentId] } } }, (err, post) => {
        response.send(post);
    });
});



app.listen(SERVER_PORT, () => {
    console.log("Server started on port " + SERVER_PORT);
});