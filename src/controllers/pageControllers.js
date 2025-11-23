// inconsistent naming but i forgot so i guess this is here
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
                foldersId: null,
            },
        });
        const folders = await db.folders.findMany({
            where: {
                usersId: req.user.id,
                parentId: null,
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
    return res.render("newFile", { title: "Upload Files", folder: undefined });
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
        folder: undefined,
    });
};

const folderGet = async (req, res, next) => {
    if (!req.user) return res.redirect("/");
    try {
        const folder = await db.folders.findFirst({
            where: {
                id: req.params.id,
                usersId: req.user.id,
            },
        });
        const files = await db.files.findMany({
            where: {
                foldersId: req.params.id,
                usersId: req.user.id,
            },
        });
        const folders = await db.folders.findMany({
            where: {
                parentId: req.params.id,
                usersId: req.user.id,
            },
        });
        if (folder) {
            return res.render("folderPage", {
                title: folder.name,
                files: files,
                folder: folder,
                folders: folders,
            });
        }
    } catch (err) {
        next(err);
    }
};

const newNestedFolderGet = async (req, res, next) => {
    if (!req.user) return res.redirect("/");
    try {
        const folder = await db.folders.findFirst({
            where: {
                id: req.params.id,
            },
        });
        res.render("newFolder", { title: folder.name, folder: folder });
    } catch (err) {
        next(err);
    }
};

const newNestedFileGet = async (req, res, next) => {
    if (!req.user) return res.redirect("/");
    try {
        const folder = await db.folders.findFirst({
            where: {
                id: req.params.id,
            },
        });
        res.render("newFile", { title: folder.name, folder: folder });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    loginGet,
    signUpGet,
    homePageGet,
    newFileGet,
    fileGet,
    newFolderGet,
    folderGet,
    newNestedFolderGet,
    newNestedFileGet,
};
