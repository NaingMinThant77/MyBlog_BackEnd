exports.get404Page = (req, res) => { // 404 - no page
    res.status(404).render("error/404", { title: "Page Not Found" })
}

exports.get500Page = (err, req, res, next) => { // 500 - server error
    // console.log(err.message)
    res.status(500).render("error/500", { title: "Something went wrong!", message: err.message })
}