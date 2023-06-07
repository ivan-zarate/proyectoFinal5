const { cartsMongo } = require("../../dbModels/cart.model");

const bcrypt = require("bcryptjs");
class UserManagerMongo {
    constructor(model) {
        this.model = model;
    };
    async signup(user) {
        try {
            const newUser = {
                username: user.username,
                password: bcrypt.hashSync(user.password, 8),
                name: user.name,
                addres: user.addres,
                age: user.age,
                telphone: user.telphone,
                avatar: user.avatar,
            }
            const userCreated = await this.model.create(newUser);
            if (userCreated) {
                return userCreated;
            } else {
                throw new Error("hubo un error al crear el usuario");
            }
        } catch (error) {
            throw new Error(`hubo un error al crear el usuario ${error.message}`)
        }
    };
    async login(users) {
        try {
            const { username, password } = users;
            const login = await this.model.findOne({ username });
            if (login) {
                const compare = bcrypt.compareSync(password, login.password);
                if (compare) {
                    return (login);
                }
                else {
                    return ("La contraseña no es correcta");
                }
            }
            else {
                return ({ succes: "El usuario no existe" })
            }
        }
        catch (error) {
            return res.status(400).send({
                error: `An error occurred ${error.message}`,
            });
        }
    }
    async getAll() {
        try {
            const users = await this.model.find();
            return users;
        } catch (error) {
            throw new Error("No se pudo obtener los usuarios");
        }
    }
    async getByName(name) {
        try {
            const user = await this.model.findOne(name);
            return user;
        } catch (error) {
            throw new Error("No se pudo obtener los usuarios");
        }
    }
    async getById(id) {
        try {
            const user = await this.model.findById(id);
            return user;
        } catch (error) {
            throw new Error("No se pudo obtener los usuarios");
        }
    }
    async getCart(user) {
        try {
            const userCart = await cartsMongo.find({ username: user.username });
            if (!userCart) {
                const newCart = new cartsMongo({ username: user.username });
                newCart.save();
                return "Se ha creado un carrito";
            }
            else {
                const result = userCart.find(cart => cart.alive === true);
                if (result) {
                    return result
                }
                else {
                    const newCart = new cartsMongo({ username: user.username });
                    newCart.save();
                    return "Se ha creado un carrito";
                }
            }
        } catch (error) {
            throw new Error("No se pudo crear el carrito");
        }
    }
}

module.exports = { UserManagerMongo }