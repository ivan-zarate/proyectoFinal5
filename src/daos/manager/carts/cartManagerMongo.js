const { productsMongo } = require("../../dbModels/product.model");
const { usersMongo } = require("../../dbModels/user.model")

class CartManagerMongo {
    constructor(model) {
        this.model = model;
    };
    // async createCart(idUser) {
    //     try {
    //         const user= await usersMongo.findById(idUser);
    //         if (user){
    //             const cartAlive= await this.model.findOne({alive});
    //             console.log("estado carrito",cartAlive);
    //         }
    //         const cart = await this.model.save();
    //         if (!productsInCart) {
    //             return ("Carrito no encontrado");
    //         }
    //         if (productsInCart.length === 0) {
    //             return ("Aun no tienes productos en el carrito");
    //         }
    //         return productsInCart;
    //     } catch (error) {
    //         throw new Error("No se pudo obtener el carrito");
    //     }
    // };
    async getCart(id) {
        try {
            const user = await usersMongo.findById(id);
            if (user) {
                const productsInCart = await this.model.find({ username: user.username });
                if (productsInCart){
                    const result = productsInCart.find(cart => cart.alive === true);
                    if (result) {
                        if (!result) {
                            return ({ message: "No se pudo obtener el carrito" });
                        }
                        else {
                            return result;
                        }
                    }
                } 
                else{
                    return ({ message: "No se pudo obtener el carrito" });
                }
            }
            else {
                return "Aun no estas registrado/logueado";
            }
        } catch (error) {
            throw new Error("No se pudo obtener el carrito");
        }
    };
    async addProduct(productId, user) {
        const cart = await this.model.find({ username: user.username });
        if (cart) {
            const result = cart.find(cart => cart.alive === true);
            if (result) {
                const productToFind = await productsMongo.find(productId);
                if (!productToFind) {
                    return ("Producto no encontrado");
                }
                const { _id, name, description, code, url, price, stock } = productToFind[0];
                const arrayCart = result.products;
                const isInCart = arrayCart.find((prod) => prod.name == name);
                if (!isInCart) {
                    const newProductInCart = ({ _id, name, description, code, url, price, stock, amount: 1 });
                    arrayCart.push(newProductInCart);
                    await productsMongo.findByIdAndUpdate(
                        productToFind[0]._id,
                        { incart: true },
                        { new: true }
                    )
                        .then(async (product) => {
                            const updatedCart = await this.model.findByIdAndUpdate(result._id, { products: arrayCart });
                            return (updatedCart)
                        })
                        .catch((error) => {
                            throw new Error("No se pudo obtener el carrito");
                        })
                }
                else if (isInCart) {
                    return ("El producto ya esta en el carrito")
                }
            }
            else {
                return "No hay carritos activos para el usuario"
            }

        }
        else {
            return "Aun no estas registrado/logueado";
        }
    }
    async updateProduct(productId, query, user) {
        try {
            const cartToFind = await this.model.find({ username: user.username });
            const result = cartToFind.find(cart => cart.alive === true);
            if (result) {
                const arrayCart = result.products;
                const productToFind = arrayCart.find((prod) =>
                    (JSON.stringify(prod._id)) === JSON.stringify(productId._id)
                )
                const newCart = arrayCart.filter(prod => (JSON.stringify(prod._id)) != JSON.stringify(productId._id));
                if (!productToFind) {
                    return ("Producto no encontrado");
                }
                else if (productToFind && query === "add") {
                    const updatedProduct = {
                        ...productToFind,
                        amount: productToFind.amount + 1,
                        stock: productToFind.stock - 1
                    }
                    if (updatedProduct.stock >= 0) {
                        console.log("updatedProduct", updatedProduct);
                        newCart.push(updatedProduct);
                        await this.model.findByIdAndUpdate(result._id,
                            { products: newCart },
                            { new: true }
                        ).then((product) => {
                            return (`Se actualizo la cantidad en ${product.amount} del producto ${product.name}`)
                        })
                    }
                    else {
                        return ("La cantidad solicitada supera al stock")
                    }
                }
                else if (productToFind && query === "del") {
                    const updatedProduct = {
                        ...productToFind,
                        amount: productToFind.amount - 1,
                        stock: productToFind.stock + 1
                    }
                    if (updatedProduct.stock >= 0) {
                        newCart.push(updatedProduct);
                        await this.model.findByIdAndUpdate(result._id,
                            { products: newCart },
                            { new: true }
                        ).then((product) => {
                            return (`Se actualizo la cantidad en ${product.amount} del producto ${product.name}`)
                        })
                    }
                    else {
                        return ("Ocurrio un error al intentar actualizar el producto en el carrito")
                    }
                }
            }

        } catch (error) {
            throw new Error("No se pudo modificar el producto");
        }
    }
    async delete(productId, user) {
        try {
            const cartToFind = await this.model.find({ username: user.username });
            const result = cartToFind.find(cart => cart.alive === true);
            if (result) {
                const arrayCart = result.products;
                const productInCart = arrayCart.find((prod) =>
                    (JSON.stringify(prod._id)) === JSON.stringify(productId._id)
                )
                if (!productInCart) {
                    return ("Producto no encontrado");
                }
                else {
                    const productToFind = await productsMongo.findOne({ name: productInCart.name });
                    console.log("productToFind", productToFind);
                    const newCart = arrayCart.filter(prod => (JSON.stringify(prod._id)) != JSON.stringify(productId._id));
                    let { _id, incart } = productToFind;
                    await this.model.findByIdAndUpdate(result._id,
                        { products: newCart },
                        { new: true }
                    )
                    await productsMongo.findByIdAndUpdate(_id,
                        { incart: false },
                        { new: true }
                    ).then((product) => {
                        return (`El producto ${product.name} fue eliminado del carrito`);
                    })
                }
            }
        } catch (error) {
            throw new Error("No se pudo eliminar el producto");
        }
    }
}

module.exports = { CartManagerMongo }