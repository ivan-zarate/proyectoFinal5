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
        if(req.user){
            const username=req.user.username
            const foundUser= await UserService.getByName({username});
            res.json({data: foundUser})
        }
        else{
            res.json({message: "Por favor para continuar debe loguearse"})
        }
    }

    static async getCart(req, res) {
            const userCart = await UserService.getCart(req.user);
            res.json({data: userCart})
    }
}

// const registerUsersController = async (req, res) => {
//     try {
//         const users = await UserService.registerUsers(req.body);
//         res.json({ status: "success", data: users });
//     } catch (error) {
//         logger.error(error.message)
//         res.json({ status: "error", message: error.message });
//     }
// };

// const loginUserController = async (req, res) => {
//     try {
//         const user = await UserService.loginUser(req.body);
//         console.log("userController", user);
//         res.json({ status: "success", data: user });
//     } catch (error) {
//         logger.error(error.message)
//         res.json({ status: "error", message: error.message });
//     }
// };
// const getUsersController = async (req, res) => {
//     try {
//         console.log("que tiene?", req.session.passport);
//         const users = await UserService.getUsers();
//         res.json({ status: "success", data: users });
//     } catch (error) {
//         logger.error(error.message)
//         res.json({ status: "error", message: error.message });
//     }
// }

// const getCartController = async (req, res) => {
//     try {
//         const userCart = await UserService.getCart(req.params);
//         res.json({ status: "success", data: userCart });
//     } catch (error) {
//         logger.error(error.message)
//         res.json({ status: "error", message: error.message });
//     }
// }

// module.exports = { registerUsersController, loginUserController, getUsersController, getCartController }

module.exports = { UsersControllers }