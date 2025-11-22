const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const db = require("../db/prisma");

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await db.users.findFirst({
                where: {
                    name: username,
                },
            });
            if (!user) {
                return done(null, false);
            }
            const validPassword = await bcrypt.compare(password, user.hash);
            if (!validPassword) {
                return done(null, false);
            }
            return done(null, user);
        } catch (err) {
            done(err);
        }
    }),
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.users.findFirst({
            where: {
                id: id,
            },
        });
        done(null, user);
    } catch (err) {
        done(err);
    }
});

module.exports = passport;
