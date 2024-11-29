exports.getLoginPage = (req, res) => {
    res.render("auth/login", { title: "LoginPage" });
}

exports.postLoginData = (req, res) => {

}