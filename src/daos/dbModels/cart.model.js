const mongoose = require("mongoose");

const schemaCartOnMongo = new mongoose.Schema(
    {
        username: { type: String, require: true },
        products: { type: Array },
        alive: { type: Boolean, default: true }
    },
    {
        timestamps: true
    }
)

const cartsMongo = mongoose.model('carts', schemaCartOnMongo);

module.exports = { cartsMongo }