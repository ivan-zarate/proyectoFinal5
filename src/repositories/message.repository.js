const {messageDao} = require("../daos/factory");

class MessageRepository{
    static async getMessages(){
        return await messageDao.getAll();
    };
    static async createMessage(message){
        return await messageDao.create(message);
    };

};

module.exports = {MessageRepository};