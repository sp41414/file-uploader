const { Router } = require("express");
const pageRouter = Router();
const pageControllers = require("../controllers/pageControllers");

pageRouter.get("/login", pageControllers.loginGet);
pageRouter.get("/signup", pageControllers.signUpGet);
pageRouter.get("/", pageControllers.homePageGet);

module.exports = pageRouter;
