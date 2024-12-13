const express = require("express");
const router = express.Router()

const postController = require("../controllers/post")
const userController = require("../controllers/user")
const { body } = require("express-validator")

router.get("/create-post", postController.renderCreatePage)

router.post("/", [
    body("title")
        .isLength({ min: 10 })
        .withMessage("Title must have 10 letters."),
    //body("photo").isURL().withMessage("Image must be a valid url")
    body("description")
        .isLength({ min: 30 })
        .withMessage("Description must have 30 letters."),
], postController.createPost);

router.post("/post/:postId", postController.deletePost)

router.get("/post-edit/:postId", postController.getOldPost);

router.post("/post-edit", [
    body("title")
        .isLength({ min: 10 })
        .withMessage("Title must have 10 letters."),
    body("description")
        .isLength({ min: 30 })
        .withMessage("Description must have 30 letters."),
], postController.updatePost);

router.get("/profile", userController.getProfile)

module.exports = router;