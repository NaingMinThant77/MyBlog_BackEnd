const Post = require("../models/post")

exports.createPost = (req, res) => {
    const { title, description, photo } = req.body;
    Post.create({ title, description, imgUrl: photo, userId: req.user }).then(
        result => {
            console.log(result)
            res.redirect("/");
        }
    ).catch(err => console.log(err))
}

exports.renderCreatePage = (req, res) => {
    res.render("addPost", { title: "Post create ml" })
}

exports.getPosts = (req, res) => {
    Post.find().select("title")
        .populate('userId', "username")
        .sort({ title: -1 }).then(
            posts => {
                // console.log(posts)
                res.render("home", { title: "HomePage", postsArr: posts, isLogin: req.session.isLogin ? true : false });
            }
        ).catch(err => console.log(err))
}

exports.getPost = (req, res) => {
    const postId = req.params.postId;
    Post.findById(postId).then(
        post => {
            res.render("details", { title: post.title, post });
        }
    ).catch(err => console.log(err))
}

exports.getOldPost = (req, res) => {
    const postId = req.params.postId;
    Post.findById(postId).then(
        post => {
            if (!post) {
                return res.redirect("/");
            }
            res.render("editPost", { title: post.title, post });
        }
    ).catch(err => console.log(err))
}

exports.updatePost = (req, res) => {
    const { postId, title, description, photo } = req.body;

    Post.findById(postId).then(
        post => {
            post.title = title;
            post.description = description;
            post.imgUrl = photo;
            return post.save()
        }).then(() => {
            console.log("Post Updated");
            res.redirect("/")
        }).catch(err => console.log(err))
}

exports.deletePost = (req, res) => {
    const postId = req.params.postId;
    Post.findByIdAndDelete(postId).then(
        () => {
            console.log("Post Deleted");
            res.redirect("/")
        }
    ).catch(err => console.log(err))

}