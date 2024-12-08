const express = require("express")
const path = require("path");

// const { posts } = require("./admin");

const router = express.Router()

const postController = require("../controllers/post")

router.get("/", postController.getPosts)

router.get("/post/:postId", postController.getPost)

router.get("/save/:id", postController.savePostAsPDF)

module.exports = router;