const { userDao } = require("../daos/factory");
class UserService {
    static async registerUsers(user) {
        return await userDao.signup(user);
    };

    static async loginUser(user) {
        return await userDao.login(user);
    }
    static async getCart(user) {
        return await userDao.getCart(user);
    }
    static async getByName(user) {
        return await userDao.getByName(user);
    };
    static async getById(id) {
        return await userDao.getById(id);
    };
};

module.exports = { UserService };