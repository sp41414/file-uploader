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
    if (!req.user) return res.redirect("/signup");
    try {
        const files = await db.files.findMany({
            where: {
                usersId: req.user.id,
                foldersId: undefined,
            },
        });
        res.render("homePage", {
            title: "File Uploader",
            user: req.user,
            files: files,
        });
    } catch (err) {
        next(err);
    }
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
