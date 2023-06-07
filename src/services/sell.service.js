const {sellDao} = require("../daos/factory");
const {UserDTO} = require("../daos/dtos/user.dto");

class SellService{
    static async newSell(id, user){
        const newUserDto=new UserDTO(user);
        return await sellDao.sell(id, newUserDto);
    };
};

module.exports = {SellService};