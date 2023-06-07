const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const { UsersControllers } = require("../controllers/user.controller");

passport.serializeUser((user, done) => {
    return done(null, user.id)
});

passport.deserializeUser((id, done) => {
    UsersControllers.getById(id).then((userDB) => {
        done(null, userDB);
    })
        .catch((err) => done(err));
});


const signup = passport.use("signUpStrategy", new LocalStrategy(
    {
        passReqToCallback: true,
        usernameField: "username",
    },
    (req, username, password, done) => {
        UsersControllers.getByName({ username }).then((userDB) => {
            if (userDB) return done(null, false, { message: `El usuario ${userDB.username} ya existe` });
            const newUser = {
                username: username,
                password: password,
                name: req.body.name,
                addres: req.body.addres,
                age: req.body.age,
                telphone: req.body.telphone,
                avatar: req.body.avatar,
            };
            UsersControllers.registerUsers(newUser).then((userDB) => {
                return done(null, userDB, { message: "Usuario creado" })
            })
                .catch((err) => {
                    return done(null, false, { message: "Hubo un error al crear al usuario" })
                })
        })
            .catch((err) => {
                return done(err, false, { message: `Hubo un error al buscar el usuario ${err}` });
            })
    }
));

const login = passport.use("loginStrategy", new LocalStrategy(
    (username, password, done) => {
        UsersControllers.getByName({ username }).then(async (userDB) => {
            if (!userDB) return done(null, false, { message: "El usuario no existe" });
            const user = {
                username,
                password
            }
            UsersControllers.login(user).then((userDB) => {
                if (userDB._id) {
                    return done(null, userDB, { message: "Usuario logueado con exito" })
                }
                else {
                    return done(null, false, { message: "La constraseña no es correcta" })
                }
            })
                .catch((err) => {
                    return done(null, false, { message: "Hubo un error al crear al usuario" })
                })
        })
            .catch((err) => {
                return done(err, false, { message: `Hubo un error al buscar el usuario ${err}` });
            })
    }
));

module.exports = { signup, login }
