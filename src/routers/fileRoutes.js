const { Router } = require("express");
const fileRouter = Router();
const fileController = require("../controllers/fileControllers");

fileRouter.post("/file/new", fileController.newFilePost);
fileRouter.get("/file/delete/:id", fileController.deleteFileGet);
fileRouter.post("/folder/new", fileController.newFolderPost);
fileRouter.post("/folder/new/:id", fileController.newNestedFolderPost);
fileRouter.post("/file/new/:id", fileController.newNestedFilePost);
fileRouter.get("/folder/delete/:id", fileController.deleteFolderGet);
fileRouter.post("/file/update/:id", fileController.updateFilePost);
fileRouter.post("/folder/update/:id", fileController.updateFolderPost);

module.exports = fileRouter;
