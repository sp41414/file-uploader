const { Router } = require("express");
const fileRouter = Router();
const fileController = require("../controllers/fileControllers");
const multer = require("../storage/multerConfig");

fileRouter.post("/file/new", multer, fileController.newFilePost);

module.exports = fileRouter;
