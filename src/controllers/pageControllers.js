const loginGet = (req, res) => {
    if (req.user) return res.redirect("/");
    res.render("login", { title: "Login" });
};

const signUpGet = (req, res) => {
    if (req.user) return res.redirect("/");
    res.render("signup", { title: "Sign Up" });
};

module.exports = {
    loginGet,
    signUpGet,
};
