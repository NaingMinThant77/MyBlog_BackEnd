const express = require("express");
const router = express.Router()

const postController = require("../controllers/post")

router.get("/create-post", postController.renderCreatePage)

router.post("/", postController.createPost);

router.post("/post/:postId", postController.deletePost)

router.get("/post-edit/:postId", postController.getOldPost);

router.post("/post-edit", postController.updatePost);

module.exports = router;