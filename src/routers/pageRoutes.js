const { Router } = require("express");
const pageRouter = Router();
const pageControllers = require("../controllers/pageControllers");

pageRouter.get("/", pageControllers.homePageGet);
pageRouter.get("/login", pageControllers.loginGet);
pageRouter.get("/signup", pageControllers.signUpGet);
pageRouter.get("/file/new", pageControllers.newFileGet);

module.exports = pageRouter;
