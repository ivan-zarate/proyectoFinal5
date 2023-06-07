const { UserService } = require("../services/user.service");
const logger = require("../logger");
class UsersControllers {

    static async registerUsers(user) {
        return await UserService.registerUsers(user);
    }

    static async getByName(user) {
        return await UserService.getByName(user);
    }

    static async getById(id) {
        return await UserService.getById(id);
    }

    static async login(user) {
        return await UserService.loginUser(user);
    }

    static async getuser(req, res) {
        if (req.user) {
            const username = req.user.username
            const foundUser = await UserService.getByName({ username });
            res.json({ data: foundUser })
        }
        else {
            res.json({ message: "Por favor para continuar debe loguearse" })
        }
    }

    static async getCart(req, res) {
        const userCart = await UserService.getCart(req.user);
        res.json({ data: userCart })
    }
}

module.exports = { UsersControllers }