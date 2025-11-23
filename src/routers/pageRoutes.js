const { Router } = require("express");
const pageRouter = Router();
const pageControllers = require("../controllers/pageControllers");

pageRouter.get("/", pageControllers.homePageGet);
pageRouter.get("/login", pageControllers.loginGet);
pageRouter.get("/signup", pageControllers.signUpGet);
pageRouter.get("/file/new", pageControllers.newFileGet);
pageRouter.get("/file/:id", pageControllers.fileGet);
pageRouter.get("/folder/new", pageControllers.newFolderGet);
pageRouter.get("/folder/:id", pageControllers.folderGet);
pageRouter.get("/folder/new/:id", pageControllers.newNestedFolderGet);
pageRouter.get("/file/new/:id", pageControllers.newNestedFileGet);
pageRouter.get("/file/update/:id", pageControllers.updateFileGet);
pageRouter.get("/folder/update/:id", pageControllers.updateFolderGet);

module.exports = pageRouter;
