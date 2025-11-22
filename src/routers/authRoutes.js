const { Router } = require("express");
const authRouter = Router();
const authController = require("../controllers/authControllers");

authRouter.post("/login", authController.loginPost);
authRouter.post("/signup", authController.signUpPost);
authRouter.get("/logout", authController.logout);

module.exports = authRouter;
