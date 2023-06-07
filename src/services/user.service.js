const {userDao} = require("../daos/factory");

const {UserDTO} = require("../daos/dtos/user.dto");
class UserService{
    static async registerUsers(user){
        return await userDao.signup(user);
    };

    static async loginUser(user){
        return await userDao.login(user);
    }
    // static async getUsers(user){
    //     const users = await userDao.getAll();
    //     const newUsersDto = users.map(user=>new UserDTO(user));
    //     return newUsersDto;
    // }
    static async getCart(user){
        return await userDao.getCart(user);
    }
    static async getByName(user){
        return await userDao.getByName(user);
    };
    static async getById(id){
        return await userDao.getById(id);
    };
};

module.exports = {UserService};