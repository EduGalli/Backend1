import { Router } from 'express';
import { prodManager } from '../app.js';

export const productsRouter = Router()


productsRouter.get('/', async (req,res) => {
    try {
        const {limit} = req.query
        const products = await prodManager.getProducts()

        if (limit){
            const limitedProducts = products.slice(0,limit)
            res.json(limitedProducts)
        } else {
            res.json(products)
        }
    } catch (error) {
        res.send('error leyendo productos')
    }
})  

productsRouter.get('/:id', async (req,res) => {
    try {
        const id = req.params.id
        const product = await prodManager.getProductById(id)
        res.json(product)
    } catch (error) {
        res.send(`Error leyendo productos id`)
    }
})

productsRouter.post('/', async (req,res) => {
    try {
        
        const response = await prodManager.addProduct(req.body)
        res.json(response)
    } catch (error) {
        res.send("Error al crear producto")
    }
})

productsRouter.put('/:id', async (req,res) => {
    const id = parseInt(req.params.id)
    try {
        const response = await prodManager.updateProduct(id,req.body)
        res.json(response)
    } catch (error) {
        console.log('Error actualizando producto')
    }
}
)


productsRouter.delete('/:id', async (req,res) => {
    const id = parseInt(req.params.id)
    try {
        const response = await prodManager.deleteProduct(id)
        res.json(response)
    } catch (error) {
        console.log('Error eliminando producto')
    }
}
)