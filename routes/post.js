const express = require("express")
const path = require("path");

// const { posts } = require("./admin");

const router = express.Router()

const postController = require("../controllers/post")

const userController = require("../controllers/user")

router.get("/", postController.getPosts)

router.get("/post/:postId", postController.getPost)

router.get("/save/:id", postController.savePostAsPDF)

router.get("/profile/:id", userController.getPublicProfile)

module.exports = router;