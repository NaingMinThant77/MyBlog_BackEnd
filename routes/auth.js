const express = require("express")
const router = express.Router();
const authController = require("../controllers/auth")
const { body } = require("express-validator");
const User = require("../models/user");
const { Error } = require("mongoose");

router.get("/register", authController.getRegisterPage);

router.post("/register", body("email").isEmail().withMessage("Please enter a valid email address").custom((value, { req }) => { //async validation
    return User.findOne({ email: value }).then(
        user => {
            if (user) {
                return Promise.reject("Email is already existed. Please enter another one.")
            }
        })
}), body("password").isLength({ min: 4 }).trim().withMessage("Password must have 5 characters."), authController.registerAccount);


router.get("/login", authController.getLoginPage);
router.post("/login", body("email").isEmail().withMessage("Please enter a valid email address"), body("password").isLength({ min: 4 }).trim().withMessage("Password must valid"), authController.postLoginData);

router.post("/logout", authController.logout);

router.get("/reset-password", authController.getResetPage)

router.get("/feekback", authController.getFeekbackPage)

router.post("/reset", authController.resetLinkSend)

router.get("/reset-password/:token", authController.getNewPasswordPage)

router.post("/change-newpassword", body("password").isLength({ min: 4 }).trim().withMessage("Password must valid"), body("confirmedpassword").trim().custom((value, { req }) => {
    if (value !== req.body.password) {
        throw new Error("Password must match!!!!")
    }
    return true;
}), authController.changeNewPassword)

router.get("/expirationPage", authController.getExperiationPage)
module.exports = router