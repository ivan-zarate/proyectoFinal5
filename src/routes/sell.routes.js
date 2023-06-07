const express = require("express");
const sellsRoutes = express.Router();
const validateCart = require("../middlewares/validateCart");
const { sellController } = require("../controllers/sell.controller");

sellsRoutes.post("/sells/:_id", validateCart, sellController);

module.exports = sellsRoutes;