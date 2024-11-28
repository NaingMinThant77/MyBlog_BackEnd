const express = require("express");
const path = require("path");
const bodyParser = require("body-parser"); //npm install body-parser
const { mongodbConnector } = require("./utils/database")

const app = express();

app.set("view engine", "ejs");
app.set("views", "views") //second para - folder name

//required middleware for external files - for css
app.use(express.static(path.join(__dirname, "public")))

//clg "req.body" in terminal
app.use(bodyParser.urlencoded({ extended: false }));

//use middleware
app.use((req, res, next) => { //not write route "/", it works on everywhere
    console.log("I am parent middleware")
    next()
})

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

mongodbConnector();
app.listen(8080);


