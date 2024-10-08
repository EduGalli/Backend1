import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import { engine } from "express-handlebars";
import { fileURLToPath } from "url"; // Importa fileURLToPath para convertir URLs a rutas de archivo
import { dirname, join } from "path"; // Importa dirname y join de path
import { Server } from "socket.io";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionRouter from "./routes/sessions.router.js";
import "./database.js";

const app = express();
const PUERTO = 8080;

// Convierte import.meta.url a una ruta de archivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(join(__dirname, 'public'))); 

app.use(session({
    secret: "secretCoder", 
    resave: true, 
    saveUninitialized: true, 
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://eduardogalli89:coderhouse@cluster0.sk8uaq4.mongodb.net/Login?retryWrites=true&w=majority&appName=Cluster0"
    })
}));

// Configuración de Handlebars
app.engine("handlebars", engine({
    layoutsDir: join(__dirname, 'views', 'layouts'), // Directorio de layouts
    defaultLayout: 'main', // Layout por defecto
}));
app.set("view engine", "handlebars"); 
app.set("views", join(__dirname, 'views')); // Directorio de vistas

// Passport
app.use(passport.initialize()); 
initializePassport(); 

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});

import ProductManager from "./dao/db/product-manager-db.js";
const productManager = new ProductManager("./src/models/product.model.js");

const io = new Server(httpServer); 

io.on("connection", async (socket) => {
    console.log("Un cliente se conecto"); 

    socket.emit("productos", await productManager.getProducts());

    socket.on("eliminarProducto", async (id) => {
        await productManager.deleteProduct(id);
        io.sockets.emit("productos", await productManager.getProducts());
    });

    socket.on("agregarProducto", async (producto) => {
        await productManager.addProduct(producto); 
        io.sockets.emit("productos", await productManager.getProducts());
    });
});