const express = require("express");
const path = require("path");
const bodyParser = require("body-parser"); //npm install body-parser
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models//user")

app.set("view engine", "ejs");
app.set("views", "views") //second para - folder name

//required middleware for external files - for css
app.use(express.static(path.join(__dirname, "public")))

//clg "req.body" in terminal
app.use(bodyParser.urlencoded({ extended: false }));


app.use((req, res, next) => {
    User.findById("67487771c59cddb35f9f8b38").then(
        user => {
            req.user = user; //custom request and add
            next();
        }
    )
})

//Routes
const postRoutes = require("./routes/post")
app.use(postRoutes);

const adminRoutes = require("./routes/admin")
app.use("/admin", adminRoutes);

mongoose.connect(process.env.MONGODB_URL).then(
    () => {
        app.listen(8080); console.log("Database connected");

        return User.findOne().then(user => {
            if (!user) {
                User.create({ username: "Marco", email: "marco@gmail.com", password: "marco123" })
            }
            return user;
        })
    }).then(result => console.log(result)).catch(err => console.log(err))


