import express from 'express'
import { productsRouter } from './routes/products.router.js'
import { cartsRouter } from './routes/carts.router.js'
import { ProductManager } from './ProductManager.js'
import { CartManager } from './CartManager.js'

const PORT = 8080

const app = express()

const productsJsonFile = "./data/products.json"
const cartJsonFile = "./data/carts.json"

export const prodManager = new ProductManager(productsJsonFile)
export const cartManager = new CartManager(cartJsonFile)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

const server = app.listen(PORT,() => console.log(`Server listening in port ${PORT}`))