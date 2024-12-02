const bcrypt = require("bcrypt") // npm i bcrypt
const User = require("../models/user")

const crypto = require("crypto");

const dotenv = require("dotenv").config();
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SENDER_MAIL,
        pass: process.env.MAIL_PASSWORD
    }
})

//render register page
exports.getRegisterPage = (req, res) => {
    res.render("auth/register", { title: "RegisterPage", errorMsg: req.flash("error")[0] })
}

//handle register
exports.registerAccount = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email }).then(
        user => {
            if (user) {
                req.flash("error", "Check your information and Try again")
                return res.redirect("/register")
            }
            return bcrypt.hash(password, 10).then(hashedPass => {
                return User.create({
                    email,
                    password: hashedPass
                })
            }).then(_ => {
                res.redirect("/login")
                transporter.sendMail({
                    from: "process.env.SENDER_MAIL",
                    to: email,
                    subject: "Login successful",
                    text: "Your message here",
                    html: "<h1>Register account successfully</h1><P>Create an account using this email address in blog.io.</P>"
                }, (err => { console.log(err) }))
                // to reduce security on process.env.SENDER_MAIL
                // turn on 2-step verification on email and add "App passwords(Mail, device - nodemailer) and will get string change with that string in MAIL_PASSWORD "
                //test with tempMail website(will get mail)
            })
        }).catch(err => console.log(err))
}

//render login page
exports.getLoginPage = (req, res) => {
    res.render("auth/login", { title: "LoginPage", errorMsg: req.flash("error")[0] });
}

//handle login
exports.postLoginData = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email }).then(
        user => {
            if (!user) {  //key, value
                req.flash("error", "Check your information and Try again")
                return res.redirect("/login")
            }
            bcrypt.compare(password, user.password).then(
                isMatch => {
                    if (isMatch) {
                        req.session.isLogin = true;
                        req.session.userInfo = user;
                        return req.session.save(err => {
                            res.redirect("/")
                            console.log(err)
                        });
                    }
                    res.redirect("/login")
                }
            ).catch(err => console.log(err))
        }).catch(err => console.log(err))
}

//handle logout
exports.logout = (req, res) => {
    req.session.destroy((_) => {
        res.redirect("/")
    });
}

exports.getResetPage = (req, res) => {
    res.render("auth/reset", { title: "ResetPage", errorMsg: req.flash("error")[0] })
}

exports.getFeekbackPage = (req, res) => {
    res.render("auth/feekback", { title: "Success" })
}

exports.getExperiationPage = (req, res) => {
    res.render("auth/expirationDisplay", { title: "Expirated" })
}

exports.resetLinkSend = (req, res) => {
    const { email } = req.body;
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect("/reset-password")
        }
        const token = buffer.toString("hex");
        User.findOne({ email }).then(user => {
            if (!user) {
                req.flash("error", "NO account found with this email.");
                return res.redirect("/reset-password")
            }
            user.resetToken = token;
            user.tokenExpiration = Date.now() + 1800000;
            return user.save();
        }).then(result => {
            res.redirect("/feekback")
            transporter.sendMail({
                from: "process.env.SENDER_MAIL",
                to: email,
                subject: "Reset Password",
                html: `<h1>Reset password.</h1><P>Change your account password by clicking the link below.</P><a href="http://localhost:8080/reset-password/${token}" target="_blank">Click me to change password!!</a>`
            }, (err => { console.log(err) }))
        }).catch(err => console.log(err))
    });
}

exports.getNewPasswordPage = (req, res) => {
    const { token } = req.params;
    User.findOne({ resetToken: token, tokenExpiration: { $gt: Date.now() } }).then(user => {
        if (user) {
            res.render("auth/newPassword", { title: "ChangePassword", errorMsg: req.flash("error")[0], resetToken: token, user_id: user._id.toString() })
        } else {
            res.redirect("/expirationPage")
        }
    }).catch(err => console.log(err))
}

exports.changeNewPassword = (req, res) => {
    const { password, confirmedpassword, user_id, resetToken } = req.body;
    let resetUser;
    User.findOne({ resetToken, tokenExpiration: { $gt: Date.now() }, _id: user_id }).then(user => {
        if (password === confirmedpassword) {
            resetUser = user;
            return bcrypt.hash(password, 10)
        } else {

        }
    }).then(
        hashPassword => {
            resetUser.password = hashPassword;
            resetUser.resetToken = undefined;
            resetUser.tokenExpiration = undefined;
            return resetUser.save();
        }
    ).then(
        _ => {
            res.redirect("/login");
        }
    ).catch(err => console.log(err))
}
