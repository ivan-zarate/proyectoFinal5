const express = require("express");
const cors = require('cors');
const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { options } = require("./config/options.js");
const newArgs = require("./config/arg.js");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cluster = require("cluster");
const os = require("os");
const numCors = os.cpus().length;
const logger = require("./logger.js");
const path = require('path')

const port = newArgs.port;

//Acceso a rutas
const productsInMongo = require("./routes/product.routes.js");
const cartsInMongo = require("./routes/cart.routes.js");
const chatInMongo = require("./routes/message.routes.js");
const sessionsMongo = require("./routes/user.routes.js");
const sellsRoutes = require("./routes/sell.routes.js");

if (newArgs.mode === "CLUSTER" && cluster.isPrimary) {
    for (let i = 0; i < numCors; i++) {
        cluster.fork();
    }
    cluster.on("exit", (worker) => {
        logger.warn(`proceso ${worker.process.pid} ha dejado de funcionar`);
        cluster.fork();
    })
}
else {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, '/public')));
    app.use(express.static(path.join(__dirname, '/views')));

    //Configuracion CORS para visualizar html correctamente
    const whiteList = ['http://localhost:8080', 'http://localhost:8080/api/login', 'http://127.0.0.1:5500', 'https://proyectofinal5-production.up.railway.app', '*']

    app.use(
        cors({
            origin: whiteList,
            methods: ["POST", "PUT", "GET", "DELETE", "OPTIONS", "HEAD"],
            header: ["*", "Authorization", "X-API-KEY", "Origin", "X-Requested-With", "Content-Type", "Accept", "Access-Control-Allow-Request-Method", 'Access-Control-Allow-Headers', 'Origin'],
            credentials: true,
        })
    );
    //Creacion de sesiones en mongoStore
    app.use(session({
        store: MongoStore.create({
            mongoUrl: options.MONGO_SESSION,
            ttl: 600,
            autoRemove: "native"
        }),
        secret: options.CLAVE_SECRETA,
        resave: false,
        saveUninitialized: true,
    }))

    //configurar passport
    app.use(passport.initialize());
    app.use(passport.session());

    //Uso de app en las distintas rutas
    app.use('/api', productsInMongo);
    app.use('/api', cartsInMongo);
    app.use('/api', chatInMongo);
    app.use('/api', sessionsMongo);
    app.use('/api', sellsRoutes);

    //Configuracion para crear mensajes
    const mensajes = [];

    io.on('connection', socket => {
        logger.info('Nuevo cliente conectado!');
        socket.emit('mensajes', mensajes);
        socket.on('mensaje', data => {
            mensajes.push({ socketid: socket.id, mensaje: data })
            io.sockets.emit('mensajes', mensajes);
        });
    });
    const srv = server.listen(port, () => {
        logger.info(`Escuchando app en el puerto ${srv.address().port} sobre el proceso ${process.pid} en modo ${newArgs.mode} sobre ambiente ${options.MODE}`);
    });

    srv.on('error', error => logger.warn(`Error en el servidor ${error}`))

    app.get("/", (req, res) => {
        res.sendFile(__dirname + '/public/index.html')
    });

}
module.exports = { app } 
