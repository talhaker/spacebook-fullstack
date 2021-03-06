class EventsHandler {
    constructor(postsRepository, postsRenderer) {
        this.postsRepository = postsRepository;
        this.postsRenderer = postsRenderer;
        this.$posts = $(".posts");
    }

    registerAddPost() {
        $('#addpost').on('click', () => {
            let $input = $("#postText");
            if ($input.val() === "") {
                alert("Please enter text!");
                return;
            }

            let self = this;
            $.post('/posts', { text: $input.val() }, (newPost) => {
                self.postsRepository.addPost(newPost);
                self.postsRenderer.renderPosts(self.postsRepository.posts);
                $input.val("");
            });
        });
    }

    registerRemovePost() {
        this.$posts.on('click', '.remove-post', (event) => {
            let self = this;
            let index = $(event.currentTarget).closest('.post').index();
            let postId = $(event.currentTarget).closest('.post').data('id');
            $.ajax('/posts/' + postId, {
                method: "DELETE",
                success: function(postId) {
                    self.postsRepository.removePost(index);
                    self.postsRenderer.renderPosts(self.postsRepository.posts);
                },
                error: function(err) {
                    console.log('Error: ' + err);
                }
            });
        });

    }

    registerToggleComments() {
        this.$posts.on('click', '.toggle-comments', (event) => {
            let $clickedPost = $(event.currentTarget).closest('.post');
            $clickedPost.find('.comments-container').toggleClass('show');
        });
    }

    registerAddComment() {
        this.$posts.on('click', '.add-comment', (event) => {
            let $comment = $(event.currentTarget).siblings('.comment');
            let $user = $(event.currentTarget).siblings('.name');

            if ($comment.val() === "" || $user.val() === "") {
                alert("Please enter your name and a comment!");
                return;
            }

            let self = this;
            let postId = $(event.currentTarget).closest('.post').data('id');
            let postIndex = $(event.currentTarget).closest('.post').index();
            let request = { postId: postId, text: $comment.val(), user: $user.val() };

            $.post('/posts/' + postId + '/comments', request, (newComment) => {
                self.postsRepository.addComment(newComment, postIndex);
                self.postsRenderer.renderComments(self.postsRepository.posts, postIndex);
                $comment.val("");
                $user.val("");
            });
        });
    }

    registerRemoveComment() {
        this.$posts.on('click', '.remove-comment', (event) => {
            let self = this;
            let $commentsList = $(event.currentTarget).closest('.post').find('.comments-list');
            let postId = $(event.currentTarget).closest('.post').data('id');
            let postIndex = $(event.currentTarget).closest('.post').index();
            let commentId = $(event.currentTarget).closest('.comment').data('id');
            let commentIndex = $(event.currentTarget).closest('.comment').index();

            $.ajax('/posts/' + postId + '/comments/' + commentId, {
                method: "DELETE",
                success: (post) => {
                    self.postsRepository.deleteComment(postIndex, commentIndex);
                    self.postsRenderer.renderComments(self.postsRepository.posts, postIndex);
                },
                error: function(err) {
                    console.log('Error: ' + err);
                }
            });
        });
    }
}

export default EventsHandler