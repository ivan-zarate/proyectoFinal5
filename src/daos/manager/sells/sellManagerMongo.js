const { cartsMongo } = require("../../dbModels/cart.model");
const { productsMongo } = require("../../dbModels/product.model");
const { usersMongo } = require("../../dbModels/user.model")
const { transporter, adminEmail } = require("../../../nodemailer/gmail");
const { twilioWapp, adminWapp, twilioClient } = require("../../../twilio/twilio.js");

class SellManagerMongo {
    constructor(model) {
        this.model = model;
    };
    async sell(id, data) {
        try {
            const cart = await cartsMongo.findById(id);
            let match = [];
            let verifyStock = [];
            let updatedStockProduct = [];
            if (cart) {
                const products = await productsMongo.find();
                // if(!products){
                //     return "Ocurrio un error al buscar los productos"
                // }
                const productsInCart = cart.products;
                productsInCart.forEach((producto) => {
                    const check = products.find((prod) => JSON.stringify(prod._id) === JSON.stringify(producto._id));
                    match.push(check)
                })
                match.forEach((producto) => {
                    productsInCart.forEach((prod) => {
                        if (JSON.stringify(prod._id) === JSON.stringify(producto._id)) {
                            if (prod.amount > producto.stock) {
                                verifyStock.push(producto)
                            }
                        }
                    })
                })
                if (verifyStock.length > 0) {
                    return verifyStock
                }
                else {
                    match.forEach((producto) => {
                        productsInCart.forEach((prod) => {
                            if (JSON.stringify(prod._id) === JSON.stringify(producto._id)) {
                                const updatedProduct = {
                                    _id: producto._id,
                                    stock: producto.stock - prod.amount,
                                }
                                updatedStockProduct.push(updatedProduct)
                            }
                        })
                    })
                    updatedStockProduct.forEach(async (prod) => {
                        await productsMongo.findByIdAndUpdate(prod._id, {
                            stock: prod.stock,
                            incart: false
                        })
                    });
                    const total = cart.products.reduce((acc, product) => acc + (product.price * product.amount), 0);
                    const sell = {
                        user: data,
                        cart: cart.products,
                        total,
                    }
                    const newSell = new this.model(sell);
                    newSell.save();
                    await cartsMongo.findByIdAndUpdate(cart._id, { alive: false })
                    if (newSell) {
                        const emailTemplate = `<div>
                            <h1>Nuevo orden compra ${newSell._id}</h1>
                            <section>${JSON.stringify(productsInCart)}</section>
                            </div>`;

                        const mailOptions = {
                            from: adminEmail,
                            to: adminEmail,
                            subject: `Nuevo pedido de ${data.name} mail: ${data.username}`,
                            html: emailTemplate
                        };
                        console.log("mailOptions",mailOptions);
                        console.log("twilioClient",twilioClient);
                        console.log("twilioWapp",twilioWapp);
                        console.log("adminWapp",adminWapp);
                        // await twilioClient.messages.create({
                        //     from: twilioWapp,
                        //     to: adminWapp,
                        //     body: `Nuevo pedido de ${data.name} mail: ${data.username}`
                        // });
                        await transporter.sendMail(mailOptions);
                        
                        return newSell;
                    }
                }
            }
            else {
                return "No se pudo encontrar el carrito";
            }
            return "Compra finalizada"
        } catch (error) {
            throw new Error("No se pudo obtener el carrito");
        }
    };
}

module.exports = { SellManagerMongo }