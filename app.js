const express = require("express");
const path = require("path");
const bodyParser = require("body-parser"); //npm install body-parser
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
// const csrf = require("csurf");// with cookie
const flash = require("connect-flash");
const multer = require("multer"); //npm install --save multer

const User = require("./models//user")

const session = require("express-session");

const mongoStore = require("connect-mongodb-session")(session)
const store = new mongoStore({
    uri: process.env.MONGODB_URI,
    collection: "sessions"
})

const storageConfigure = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads")
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    },
})

const fileFilterConfigure = (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

//required middleware for external files - for css
app.use(express.static(path.join(__dirname, "public")))
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

//clg "req.body" in terminal
app.use(bodyParser.urlencoded({ extended: false }));

app.use(multer({ storage: storageConfigure, fileFilter: fileFilterConfigure }).single("photo"))

app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store
}));



// const csrfProtect = csrf();
// app.use(csrfProtect);

app.set("view engine", "ejs");
app.set("views", "views") //second para - folder name


app.use((req, res, next) => {
    if (req.session.isLogin === undefined) {
        return next()
    }
    User.findById(req.session.userInfo._id).select("_id email").then(
        user => {
            req.user = user; //custom request and add
            console.log(req.user)
            next();
        }
    )
})

app.use(flash());

// //to send csrf token for every page
app.use((req, res, next) => {
    res.locals.isLogin = req.session.isLogin ? true : false;
    // res.locals.csrfToken = req.csrfToken();
    next();
})
// <!-- <input type="hidden" name="_csrf" value="<%= csrfToken %>"> -->

//Routes
const { isLogin } = require("./middleware/is-login")
const postRoutes = require("./routes/post")
app.use(postRoutes);

const adminRoutes = require("./routes/admin")
app.use("/admin", isLogin, adminRoutes);

const authRoutes = require("./routes/auth")
app.use(authRoutes)

const errorController = require("./controllers/error")
app.all("*", errorController.get404Page);

//error middleware
app.use(errorController.get500Page);

mongoose.connect(process.env.MONGODB_URL).then(
    () => {
        app.listen(8080);
        console.log("Database connected");
    }).catch(err => console.log(err))


