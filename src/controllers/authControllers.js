const db = require("../db/prisma");
const { body, validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const validateUser = [
    body("username")
        .trim()
        .isLength({ min: 1, max: 20 })
        .withMessage(`Username must be between 1 and 20 characters long`)
        .matches(/^[a-zA-Z0-9 ]*$/)
        .withMessage(`Username must only have characters numbers and spaces`),
    body("password")
        .trim()
        .isLength({ min: 6, max: 32 })
        .withMessage(`Password must be between 6 and 32 characters long`)
        .matches(/^(?=.*[a-z0-9])[a-z0-9!@#$%&*.]+$/i)
        .withMessage(
            `Password must only have characters, numbers, and special characters`,
        ),
];

const loginPost = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login-fail",
});
const signUpPost = [
    validateUser,
    async (req, res, next) => {
        if (req.user) return res.redirect("/");
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.render("signup", {
                title: "Sign Up",
                errors: err.errors,
            });
        }
        const { username, password } = matchedData(req);
        try {
            const userAlreadyExists = await db.users.findFirst({
                where: {
                    name: username,
                },
            });
            if (userAlreadyExists) {
                return res.render("signup", {
                    title: "Sign Up",
                    errors: [{ msg: "Username is taken" }],
                });
            }
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);
            await db.users.create({
                data: {
                    name: username,
                    hash: hashedPassword,
                },
            });
            res.redirect("/login");
        } catch (err) {
            next(err);
        }
    },
];

const logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
};

module.exports = {
    loginPost,
    signUpPost,
    logout,
};
