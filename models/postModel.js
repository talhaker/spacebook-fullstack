var mongoose = require('mongoose');

//design the two schema below and use sub docs 
//to define the relationship between posts and comments

// This is a one-to-many relationship
// A comment is part of its parent post
let commentSchema = new mongoose.Schema({
    user: String,
    text: String
});


// A post can have zero or more child comments
let postSchema = new mongoose.Schema({
    postText: String,
    comments: [commentSchema]
});

let Post = mongoose.model('post', postSchema);

module.exports = Post;