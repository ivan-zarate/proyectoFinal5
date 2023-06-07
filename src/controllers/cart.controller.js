const {CartService} = require("../services/cart.service");
const logger=require("../logger");

const cartController = async(req,res)=>{
    try {
        if(req.user){
            const productsInCart = await CartService.getCartProducts(req.user._id);
            if(productsInCart.products.length===0){
                res.json({status:"success",message: "Aun no tienes productos en el carrito"})
            }
            else{
                res.json({status:"success",data:productsInCart});
            }
        }
        else{
            res.json({status:"success",empty: "Aun no estas registrado/logueado"});
        }
        
    } catch (error) {
        logger.error(error.message)
        res.json({status:"error",message:error.message});
    }
};

const addProductController = async(req,res)=>{
    try {
        const newProduct = await CartService.addProduct(req.params, req.user);
        res.json({status:"success",data:newProduct});
    } catch (error) {
        logger.error(error.message)
        res.json({status:"error",message:error.message});
    }
};
const editProductInCartController = async(req,res)=>{
    try {
        const {query}= req.query;
        const editedProduct = await CartService.updateProduct(req.params, query, req.user);
        res.json({status:"success",data:editedProduct});
    } catch (error) {
        logger.error(error.message)
        res.json({status:"error",message:error.message});
    }
};
const deleteProductInCartController = async(req,res)=>{
    try {
        const deletedProduct = await CartService.deleteProduct(req.params, req.user);
        res.json({status:"success",data:deletedProduct});
    } catch (error) {
        logger.error(error.message)
        res.json({status:"error",message:error.message});
    }
};

module.exports = {cartController,addProductController, editProductInCartController, deleteProductInCartController}