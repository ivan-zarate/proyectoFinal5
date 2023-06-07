const {cartDao} = require("../daos/factory");

class CartService{
    static async getCartProducts(id){
        return await cartDao.getCart(id);
    };
    static async addProduct(productId, user){
        return await cartDao.addProduct(productId,user);
    };
    static async updateProduct(productId, query, user){
        return await cartDao.updateProduct(productId, query, user);
    };
     static async deleteProduct(productId, user){
        return await cartDao.delete(productId, user);
    };

};

module.exports = {CartService};