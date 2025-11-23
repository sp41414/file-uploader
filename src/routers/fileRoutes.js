const { Router } = require("express");
const fileRouter = Router();
const fileController = require("../controllers/fileControllers");

fileRouter.post("/file/new", fileController.newFilePost);
fileRouter.get("/file/delete/:id", fileController.deleteFileGet);
fileRouter.post("/folder/new", fileController.newFolderPost);

module.exports = fileRouter;
