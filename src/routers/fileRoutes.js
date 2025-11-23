const { Router } = require("express");
const fileRouter = Router();
const fileController = require("../controllers/fileControllers");

fileRouter.post("/file/new", fileController.newFilePost);
fileRouter.get("/file/delete/:id", fileController.deleteFileGet);
fileRouter.post("/folder/new", fileController.newFolderPost);
fileRouter.post("/folder/new/:id", fileController.newNestedFolderPost);
fileRouter.post("/file/new/:id", fileController.newNestedFilePost);

module.exports = fileRouter;
