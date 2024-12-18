const express = require("express");
const router = express.Router()

const postController = require("../controllers/post")
const userController = require("../controllers/user")
const { body } = require("express-validator")

const { isPremium } = require("../middleware/is-premium")

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

router.get("/username", userController.renderUsernamePage)

router.post("/setusername", body("username").isLength({ min: 4 }).withMessage("username must have 4 letters"), userController.setUsername)

router.get("/premium", userController.renderPremiumPage)

router.get("/subscription-success", userController.getSuccessPage)

router.get("/premium-details", userController.getPremiumDetails)

router.get("/subscription-cancel", userController.renderPremiumPage)

router.get("/profile-image", isPremium, userController.getProfileUploadPage)

router.post("/set-profile", isPremium, userController.setProfileImage);

module.exports = router;