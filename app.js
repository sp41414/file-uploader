require("dotenv").config();
const express = require("express");
const session = require("express-session");
const prisma = require("./src/db/prisma");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const path = require("path");
const passport = require("./src/auth/passport");
const pageRoutes = require("./src/routers/pageRoutes");
const authRoutes = require("./src/routers/authRoutes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
        },
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
        store: new PrismaSessionStore(prisma, {
            checkPeriod: 2 * 60 * 1000, // 2 minutes
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        }),
    }),
);

app.use(passport.session());

app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "ejs");

app.use("/", pageRoutes);
app.use("/", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`App Listening on port ${PORT}`);
});
