const logger = require("../logger.js");

const validateBodyMessage = (req, res, next) => {
    if (req.body.email && req.body.name && req.body.lastname && req.body.age && req.body.alias && req.body.avatar && req.body.text) {
      req.isCorrect = true;
      return next();
    }
    logger.error("Por favor ingresar todos los campos");
    throw new Error("The body is required");
  };
  
  module.exports = validateBodyMessage;