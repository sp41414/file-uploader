const { Router } = require("express");
const fileRouter = Router();
const fileController = require("../controllers/fileControllers");

fileRouter.post("/file/new", fileController.newFilePost);
fileRouter.get("/file/delete/:id", fileController.deleteFileGet);

module.exports = fileRouter;
