const {MessageRepository} = require("../repositories/message.repository");
const logger=require("../logger");

const messageController = async(req,res)=>{
    try {
        const messages = await MessageRepository.getMessages();
        res.json({status:"success",data:messages});
    } catch (error) {
        logger.error(error.message)
        res.json({status:"error",message:error.message});
    }
};

const createMessageController = async(req,res)=>{
    try {
        const newMessage = await MessageRepository.createMessage(req.body);
        res.json({status:"success",data:newMessage});
    } catch (error) {
        logger.error(error.message)
        res.json({status:"error",message:error.message});
    }
};

module.exports = {messageController,createMessageController}