const Post = require("../models/post")
const { validationResult } = require("express-validator")
const User = require("../models/user")

const POST_PAR_PAGE = 6;

exports.getProfile = (req, res, next) => {
    const pageNumber = +req.query.page || 1;
    let totalPostNumber;

    Post.find({ userId: req.user._id }).countDocuments().then(totalPostCount => {
        totalPostNumber = totalPostCount;
        return Post.find({ userId: req.user._id }).populate('userId', "email username")
            .skip((pageNumber - 1) * POST_PAR_PAGE).limit(POST_PAR_PAGE)
            .sort({ createdAt: -1 })
    }).then(posts => {
        // console.log(posts)
        if (posts.length > 0) {
            res.render("user/profile", {
                title: req.session.userInfo.email,
                postsArr: posts,
                // isLogin: req.session.isLogin ? true : false,
                currentPage: pageNumber,
                hasNextPage: POST_PAR_PAGE * pageNumber < totalPostNumber,
                hasPreviousPage: pageNumber > 1,
                nextPage: pageNumber + 1,
                previousPage: pageNumber - 1,
                currentUserEmail: req.session.userInfo ? req.session.userInfo.email : ""
            });
        } else {
            return res.status(500).render("error/500", { title: "Something went wrong!", message: "No post in this page query" })
        }
    }).catch(err => {
        console.log(err)
        return next(new Error("Something went wrong when getting all posts")); //error middleware
    })
}

exports.getPublicProfile = (req, res, next) => {
    const { id } = req.params;
    const pageNumber = +req.query.page || 1;
    let totalPostNumber;

    Post.find({ userId: id }).countDocuments().then(totalPostCount => {
        totalPostNumber = totalPostCount;
        return Post.find({ userId: id }).populate('userId', "email")
            .skip((pageNumber - 1) * POST_PAR_PAGE).limit(POST_PAR_PAGE)
            .sort({ createdAt: -1 })
    }).then(posts => {
        // console.log(posts)
        if (posts.length > 0) {
            res.render("user/public-profile", {
                title: posts[0].userId.email,
                postsArr: posts,
                // isLogin: req.session.isLogin ? true : false,
                currentPage: pageNumber,
                hasNextPage: POST_PAR_PAGE * pageNumber < totalPostNumber,
                hasPreviousPage: pageNumber > 1,
                nextPage: pageNumber + 1,
                previousPage: pageNumber - 1,
                currentUserEmail: posts[0].userId.email
            });
        } else {
            return res.status(500).render("error/500", { title: "Something went wrong!", message: "No post in this page query" })
        }
    }).catch(err => {
        console.log(err)
        return next(new Error("Something went wrong when getting all posts")); //error middleware
    })
}

exports.renderUsernamePage = (req, res) => {
    res.render("user/username", { title: "SetUsername", errorMsg: req.flash("error")[0], oldFormData: { username: "" } })
}

exports.setUsername = (req, res, next) => {
    const { username } = req.body;
    const Updatedusername = username.replace("@", "")

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render("user/username", {
            title: "Reset Username",
            errorMsg: errors.array()[0].msg,
            oldFormData: { username }
        })
    }
    //current user
    User.findById(req.user._id).then(user => {
        user.username = `@${Updatedusername}`;
        return user.save().then(() => {
            console.log("Username Updated")
            res.redirect("/admin/profile")
        })
    }).catch(err => {
        console.log(err)
        return next(new Error("Something went wrong when setting username")); //error middleware
    })
}

exports.renderPremiumPage = (req, res) => {
    res.render("user/premium", { title: "PremiumPage" })
}