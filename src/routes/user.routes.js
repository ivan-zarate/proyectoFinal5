const express = require("express");
const sessionsMongo = express.Router();
const { signup, login } = require("../middlewares/passportLocal");
const { UsersControllers } = require("../controllers/user.controller");


sessionsMongo.post("/signup", signup.authenticate("signUpStrategy", {
    failureMessage: true,
    failureRedirect: "/errores",

}), (req, res) => {
    res.json("Usuario creado")
});


sessionsMongo.post("/login", login.authenticate("loginStrategy", {
    failureMessage: true,
    failureRedirect: "/errores",

}), (req, res) => {
    res.json(req.user)
});

sessionsMongo.get("/getusers", UsersControllers.getuser);
sessionsMongo.get("/getCart", UsersControllers.getCart);

sessionsMongo.get("/errores", (req, res) => {
    const errorMsg = req.session.messages ? req.session.messages[0] : '';
    req.session.messages = [];
    res.json({ error: errorMsg });

})

sessionsMongo.delete("/logout", (req, res) => {
    req.logout(error => {
        if (error) return res.send("Hubo un error al cerrar la sesion");
        req.session.destroy(error => {
            if (error) return res.send("Hubo un error al cerrar la sesion");
            res.json({ message: "Sesion finalizada" })
        });
    })
})

module.exports = sessionsMongo;