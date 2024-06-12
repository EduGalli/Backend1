import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

const PORT = 8080

const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

const server = app.listen(PORT,() => console.log(`Server escuchando en port ${PORT}`))