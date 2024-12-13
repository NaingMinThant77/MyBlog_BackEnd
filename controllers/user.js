const Post = require("../models/post")

const POST_PAR_PAGE = 6;

exports.getProfile = (req, res, next) => {
    const pageNumber = +req.query.page || 1;
    let totalPostNumber;

    Post.find({ userId: req.user._id }).countDocuments().then(totalPostCount => {
        totalPostNumber = totalPostCount;
        return Post.find({ userId: req.user._id }).populate('userId', "email")
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