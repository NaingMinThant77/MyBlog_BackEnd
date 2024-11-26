const express = require("express");
const path = require("path");
const bodyParser = require("body-parser"); //npm install body-parser

const sequelize = require("./utils/database")

const Post = require("./models/post")
const User = require("./models/user")

const app = express();

app.use((req, res, next) => {
    User.findByPk(1).then((user) => {
        req.user = user;
        console.log(user)
        next();
    }).catch(err => console.log(err))
})

app.set("view engine", "ejs");
//second para - folder name
app.set("views", "views")

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

const postRoutes = require("./routes/post")
app.use(postRoutes);

const adminRoutes = require("./routes/admin")
app.use("/admin", adminRoutes);

Post.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Post);
//{ force: true }
sequelize.sync().then(
    result => {
        return User.findByPk(1);
    }
).then(user => {
    if (!user) {
        return User.create({ name: "CodeHub", email: "abcd@gmail.com" })
    }
    return user
}).then(
    user => {
        console.log(user)
        app.listen(8080)
    }
).catch(err => console.log(err))


