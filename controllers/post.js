const Post = require("../models/post")

const { validationResult } = require("express-validator");
const { format } = require("date-fns"); //npm install date-fns --save

const fileDelete = require("../utils/fileDelete")

const pdf = require("pdf-creator-node") //npm i pdf-creator-node --save
const fs = require("fs");
const expressPath = require("path");

exports.createPost = (req, res, next) => {
    const { title, description } = req.body;

    const image = req.file;

    if (image === undefined) {
        return res.status(422).render("addPost", {
            title: "PostCreate",
            errorMsg: "Image extension must be jpg, png and jpeg",
            oldFormData: { title, description }
        })
    }

    console.log(image.path)

    const errors = validationResult(req);
    if (!errors.isEmpty()) { //422 - validation
        return res.status(422).render("addPost", {
            title: "PostCreate",
            errorMsg: errors.array()[0].msg,
            oldFormData: { title, description }
        })
    }
    //imgUrl: photo
    Post.create({ title, description, imgUrl: image.path, userId: req.user }).then(
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
    res.render("addPost", {
        title: "PostCreate", errorMsg: "",
        oldFormData: { title: "", description: "" }
    })
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
                date: post.updatedAt ? format(post.updatedAt, 'yyyy-MM-dd') : undefined,
                currentLoginUserId: req.session.userInfo
                    ? req.session.userInfo._id
                    : "",
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
            res.render("editPost", {
                postId,
                title: post.title,
                post,
                errorMsg: "",
                oldFormData: {
                    title: undefined,
                    description: undefined,
                },
                isValidationFail: false,
            });
        }
    ).catch(err => {
        console.log(err)
        return next(new Error("Something went wrong when getting old post data")); //error middleware
    })
}

exports.updatePost = (req, res, next) => {
    const { postId, title, description } = req.body;

    const errors = validationResult(req);

    const image = req.file;

    // if (image === undefined) {
    //     return res.status(422).render("editPost", {
    //         postId,
    //         title,
    //         errorMsg: "Image extension must be jpg, png and jpeg",
    //         oldFormData: { title, description }
    //     })
    // }

    if (!errors.isEmpty()) {
        return res.status(422).render("editPost", {
            postId,
            title,
            errorMsg: errors.array()[0].msg,
            oldFormData: { title, description },
            isValidationFail: true,
        });
    }

    Post.findById(postId).then(
        post => {
            if (post.userId.toString() !== req.user._id.toString()) {
                return res.redirect("/")
            }
            post.title = title;
            post.description = description;
            // post.imgUrl = photo;
            if (image) {
                fileDelete(post.imgUrl)
                post.imgUrl = image.path;
            }

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
    Post.findById(postId).then(
        post => {
            if (!post) { return res.redirect("/") }
            fileDelete(post.imgUrl)
            return Post.deleteOne({ _id: postId, userId: req.user._id })
        }).then(() => {
            console.log("Post Deleted");
            res.redirect("/")
        }).catch(err => {
            console.log(err)
            return next(new Error("Something went wrong when deleting post")); //error middleware
        })
}

exports.savePostAsPDF = async (req, res, next) => {
    try {
        const { id } = req.params;
        const templateUrl = `${expressPath.join(__dirname, "../views/template/template.html")}`;
        const html = fs.readFileSync(templateUrl, "utf8");
        const options = {
            format: "A3",
            orientation: "portrait",
            border: "10mm",
            header: {
                height: "45mm",
                contents: '<div style="text-align: center;">PDF DOWNLOAD FROM BLOG.IO</div>'
            },
            footer: {
                height: "28mm",
                contents: {
                    first: 'Cover page',
                    contents: '<span style="color: #444; text-align: center">@marco.mm</span>'
                }
            }
        };

        const post = await Post.findById(id).populate("userId", "email").lean();
        const date = new Date();
        const pdfSaveUrl = `${expressPath.join(__dirname, "../public/pdf", date.getTime() + ".pdf")}`;

        const document = {
            html,
            data: { post },
            path: pdfSaveUrl,
            type: ""
        };

        await pdf.create(document, options);
        res.download(pdfSaveUrl, (err) => {
            if (err) throw err;
            fileDelete(pdfSaveUrl);
        });
    } catch (err) {
        console.log(err);
        next(new Error("Something went wrong when saving post as PDF"));
    }
};

