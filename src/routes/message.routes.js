const express = require("express");
const chatInMongo = express.Router();
const validateBodyMessage = require("../middlewares/validateBody");
const { messageController, createMessageController } = require("../controllers/message.controller");

chatInMongo.get("/messages", messageController);
chatInMongo.post("/messages", validateBodyMessage, createMessageController);

module.exports = chatInMongo;