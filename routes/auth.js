const express = require("express")
const router = express.Router();
const authController = require("../controllers/auth")

router.get("/register", authController.getRegisterPage);
router.post("/register", authController.registerAccount);

router.get("/login", authController.getLoginPage);
router.post("/login", authController.postLoginData);

router.post("/logout", authController.logout);

router.get("/reset-password", authController.getResetPage)

router.get("/feekback", authController.getFeekbackPage)

router.post("/reset", authController.resetLinkSend)

router.get("/reset-password/:token", authController.getNewPasswordPage)

router.post("/change-newpassword", authController.changeNewPassword)

router.get("/expirationPage", authController.getExperiationPage)
module.exports = router