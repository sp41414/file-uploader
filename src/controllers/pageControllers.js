const db = require("../db/prisma");

const loginGet = (req, res) => {
    if (req.user) return res.redirect("/");
    res.render("login", { title: "Login" });
};

const signUpGet = (req, res) => {
    if (req.user) return res.redirect("/");
    res.render("signup", { title: "Sign Up" });
};

const homePageGet = async (req, res, next) => {
    res.render("homePage", {
        title: "File Uploader",
        user: req.user,
    });
};

const newFileGet = (req, res) => {
    if (!req.user) return res.redirect("/login");
    return res.render("newFile", { title: "Upload Files" });
};

module.exports = {
    loginGet,
    signUpGet,
    homePageGet,
    newFileGet,
};
