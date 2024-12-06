const Post = require("../models/post")

exports.createPost = (req, res, next) => {
    const { title, description, photo } = req.body;
    Post.create({ title, description, imgUrl: photo, userId: req.user }).then(
        result => {
            // console.log(result)
            res.redirect("/");
        }
    ).catch(err => {
        console.log(err)
        return next(new Error("Something went wrong when creating post")); //error middleware
    })
}

exports.renderCreatePage = (req, res) => {
    res.render("addPost", { title: "Post create ml" })
}

exports.getPosts = (req, res, next) => {
    Post.find().select("title description")
        .populate('userId', "email")
        .sort({ title: -1 }).then(
            posts => {
                // console.log(posts)
                res.render("home", {
                    title: "HomePage",
                    postsArr: posts,
                    isLogin: req.session.isLogin ? true : false,
                    currentUserEmail: req.session.userInfo ? req.session.userInfo.email : ""
                });

            }
        ).catch(err => {
            console.log(err)
            return next(new Error("Something went wrong when getting all posts")); //error middleware
        })
}

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId).populate("userId", "email").then(
        post => {
            res.render("details", {
                title: post.title,
                post,
                date: post.createAt ? formatISO9075(post.createAt, { representation: "date" }) : undefined,
                currentLoginUserId: req.session.userInfo ? req.session.userInfo._id : ""
            });
        }
    ).catch(err => {
        console.log(err)
        return next(new Error("Something went wrong when getting that id post")); //error middleware
    })
}

exports.getOldPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId).then(
        post => {
            if (!post) {
                return res.redirect("/");
            }
            res.render("editPost", { title: post.title, post });
        }
    ).catch(err => {
        console.log(err)
        return next(new Error("Something went wrong when getting old post data")); //error middleware
    })
}

exports.updatePost = (req, res, next) => {
    const { postId, title, description, photo } = req.body;

    Post.findById(postId).then(
        post => {
            if (post.userId.toString() !== req.user._id.toString()) {
                return res.redirect("/")
            }
            post.title = title;
            post.description = description;
            post.imgUrl = photo;
            return post.save().then(() => {
                console.log("Post Updated");
                res.redirect("/")
            })
        }).catch(err => {
            console.log(err)
            return next(new Error("Something went wrong when updating post")); //error middleware
        })
}

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.deleteOne({ _id: postId, userId: req.user._id }).then(
        () => {
            console.log("Post Deleted");
            res.redirect("/")
        }
    ).catch(err => {
        console.log(err)
        return next(new Error("Something went wrong when deleting post")); //error middleware
    })

}