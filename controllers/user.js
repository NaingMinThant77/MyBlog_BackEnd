const Post = require("../models/post")
const { validationResult } = require("express-validator")
const User = require("../models/user")
const path = require("path");

const stripe = require("stripe")("sk_test_51QWDaeGoFgMOImd9s7yXYfOZw2CXKhLWSx6mn66EDSuPRKJx1tArKgTlhn22830yLeFyy8I8hoR3rVQG5qq5kis200S2XcfyUA") //npm install stripe --save

const POST_PAR_PAGE = 6;

exports.getProfile = (req, res, next) => {
    const pageNumber = +req.query.page || 1;
    let totalPostNumber;

    Post.find({ userId: req.user._id }).countDocuments().then(totalPostCount => {
        totalPostNumber = totalPostCount;
        return Post.find({ userId: req.user._id }).populate('userId', "email username isPremium profile_imgUrl")
            .skip((pageNumber - 1) * POST_PAR_PAGE).limit(POST_PAR_PAGE)
            .sort({ createdAt: -1 })
    }).then(posts => {
        // console.log(posts)
        if (!posts.length && pageNumber > 1) {
            return res.status(500).render("error/500", { title: "Something went wrong!", message: "No post in this page query" })
        } else {
            return res.render("user/profile", {
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
        return Post.find({ userId: id }).populate('userId', "email isPremium username profile_imgUrl")
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

exports.renderPremiumPage = (req, res, next) => {
    stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price: "price_1QWIGEGoFgMOImd9sFTDJSrp", //priceId
            quantity: 1,

        }],
        mode: "subscription",
        success_url: `${req.protocol}://${req.get("host")}/admin/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.protocol}://${req.get("host")}/admin/subscription-cancel`
    }).then(stripe_session => {
        res.render("user/premium", { title: "Buy Premium", session_id: stripe_session.id })
    }).catch(err => {
        console.log(err)
        return next(new Error("Something went wrong when rendering premium page"));
    })
}

exports.getSuccessPage = (req, res) => {
    const session_id = req.query.session_id;
    if (!session_id || !session_id.includes("cs_test_")) {
        return res.redirect("/admin/profile");
    }
    User.findById(req.user._id).then(user => {
        user.isPremium = true
        user.payment_session_key = session_id
        return user.save()
    }).then(() => {
        res.render("user/subscription-success", { title: "Success" })
    }).catch(err => {
        console.log(err)
        return next(new Error("Something went wrong when rendering success page"));
    })
}

exports.getPremiumDetails = (req, res, next) => {
    User.findById(req.user._id)
        .then(user => {
            return stripe.checkout.sessions.retrieve(user.payment_session_key);
        })
        .then(stripe_session => {
            res.render("user/premium-details", {
                title: "Status",
                customer_id: stripe_session.customer,
                country: stripe_session.customer_details.address?.country || "N/A", // Handle null/undefined gracefully
                postal_code: stripe_session.customer_details.address?.postal_code || "N/A",
                email: stripe_session.customer_details.email || "N/A", // Corrected email access
                name: stripe_session.customer_details.name || "N/A", // Corrected name access
                invoice_id: stripe_session.invoice || "N/A",
                status: stripe_session.payment_status || "N/A"
            });
        })
        .catch(err => {
            console.error(err);
            return next(new Error("Something went wrong when rendering success page"));
        });
};

exports.getProfileUploadPage = (req, res) => {
    res.render("user/profile-upload", { title: "Profile Image", errorMsg: "" })
}

exports.setProfileImage = (req, res, next) => {
    const photo = req.file;

    if (photo === undefined) {
        return res.status(422).render("user/profile-upload", {
            title: "Profile Image",
            errorMsg: "Image extension must be jpg, png and jpeg",
        })
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) { //422 - validation
        return res.status(422).render("user/profile-upload", {
            title: "Profile Image",
            errorMsg: errors.array()[0].msg,
        })
    }

    User.findById(req.user._id)
        .then(user => {
            user.profile_imgUrl = photo.path;
            return user.save();
        })
        .then(_ => {
            res.redirect("/admin/profile");
        })
        .catch(err => {
            console.error(err);
            return next(new Error("Something went wrong when uploading the profile image."));
        });
}
