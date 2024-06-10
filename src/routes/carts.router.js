import { Router } from 'express';
import { cartManager } from '../app.js';

export const cartsRouter = Router()

cartsRouter.post('/', async (req,res) => {
    try {
        const response = await cartManager.addNewCart()
        res.json(response)
    } catch (error) {
        res.send('Error adding new cart')
    }
 
})

cartsRouter.get('/:id', async (req,res) => {
    const { id } = req.params
    try {
        const response = await cartManager.getCartProducts(parseInt(id))
        res.send(response)      
    } catch (error) {
        res.send('error to access to products cart')
    }
} )

cartsRouter.post('/:cid/product/:pid', async (req,res)  => {
    const { cid, pid } = req.params
    try {
        await cartManager.addProducttoCart(parseInt(cid),parseInt(pid))
        res.send('product added to cart')
    } catch (error) {
        res.send('Error to add product to Cart')
    }
})