const express = require("express");
const path = require("path");
const bodyParser = require("body-parser"); //npm install body-parser
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

app.set("view engine", "ejs");
app.set("views", "views") //second para - folder name

//required middleware for external files - for css
app.use(express.static(path.join(__dirname, "public")))

//clg "req.body" in terminal
app.use(bodyParser.urlencoded({ extended: false }));


app.use("/post", (req, res, next) => {
    console.log("I am post middleware")
    next()
})

app.use("/admin", (req, res, next) => {
    console.log("admin middleware approved!")
    next();
})

//Routes
const postRoutes = require("./routes/post")
app.use(postRoutes);

const adminRoutes = require("./routes/admin")
app.use("/admin", adminRoutes);

mongoose.connect(process.env.MONGODB_URL).then(
    () => { console.log("Database connected"); app.listen(8080); }
).catch(err => console.log(err))


