// const posts = [];

const Post = require("../models/post");

exports.createPost = (req, res) => {
    const { title, description, photo } = req.body;
    // Post.create({
    req.user.createPost({
        title, description, imgUrl: photo
        // userId: req.user.id
    }).then((result) => {
        res.redirect("/")
        console.log(result);
        console.log("New Post Created")
    }).catch(err => console.log(err))
}

exports.renderCreatePage = (req, res) => {
    res.render("addPost", { title: "Post create ml" })
}

exports.getPosts = (req, res) => {
    Post.findAll({ order: [["createdAt", "desc"]] }).then(
        posts => {
            res.render("home", { title: "Home Page", postsArr: posts });
        }
    ).catch(err => console.log(err))
}

exports.getPost = (req, res) => {
    const postId = req.params.postId;
    // Post.findOne({ where: { id: postId } }).then(
    Post.findByPk(postId).then(
        post => {
            res.render("details", { title: "Post Details Page", post })
        }
    ).catch(err => console.log(err))
}

exports.deletePost = (req, res) => {
    const postId = req.params.postId;
    Post.findByPk(postId).then(
        (post) => {
            if (!post) {
                res.redirect("/")
            }
            return post.destroy()
        }
    ).then(result => {
        console.log("Post Delete!!")
        res.redirect("/")
    }).catch(err => console.log(err))
}

exports.getOldPost = (req, res) => {
    const postId = req.params.postId;
    Post.findByPk(postId).then(
        post => {
            res.render("editPost", { title: `${post.title}`, post })
        }
    ).catch(err => console.log(err))
}

exports.updatePost = (req, res) => {
    const { title, photo, description, postId } = req.body;
    Post.findByPk(postId).then(
        post => {
            post.title = title,
                post.imgUrl = photo,
                post.description = description
            return post.save()
        }
    ).then(result => {
        console.log(`Post id => ${postId} is updated successfully`)
        res.redirect("/")
    }).catch(err => console.log(err))
}