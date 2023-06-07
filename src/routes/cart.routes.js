const express = require("express");
const cartsInMongo = express.Router();
const {cartController, addProductController, editProductInCartController, deleteProductInCartController} = require("../controllers/cart.controller");

//definir las rutas para usuarios
cartsInMongo.get("/cart-products/:_id",cartController);
cartsInMongo.post("/cart-products/:_id", addProductController);
cartsInMongo.put("/cart-products/:_id", editProductInCartController);
cartsInMongo.delete("/cart-products/:_id", deleteProductInCartController);

module.exports = cartsInMongo;