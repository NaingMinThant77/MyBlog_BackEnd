const bcrypt = require("bcrypt") // npm i bcrypt
const User = require("../models/user")
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