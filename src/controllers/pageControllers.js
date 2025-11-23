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
        const folders = await db.folders.findMany({
            where: {
                usersId: req.user.id,
            },
        });
        res.render("homePage", {
            title: "File Uploader",
            user: req.user,
            files: files,
            folders: folders,
        });
    } catch (err) {
        next(err);
    }
};

const newFileGet = (req, res) => {
    if (!req.user) return res.redirect("/login");
    return res.render("newFile", { title: "Upload Files" });
};

const fileGet = async (req, res, next) => {
    if (!req.user) return res.redirect("/");
    try {
        const file = await db.files.findFirst({
            where: {
                usersId: req.user.id,
                id: req.params.id,
            },
        });
        if (!file) return res.redirect("/");
        return res.render("fileView", { title: file.name, file: file });
    } catch (err) {
        next(err);
    }
};

const newFolderGet = (req, res) => {
    if (!req.user) return res.redirect("/");
    return res.render("newFolder", {
        title: "Create Folder",
    });
};

const folderGet = (req, res) => { };

module.exports = {
    loginGet,
    signUpGet,
    homePageGet,
    newFileGet,
    fileGet,
    newFolderGet,
    folderGet,
};
