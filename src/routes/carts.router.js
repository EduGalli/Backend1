import { Router } from 'express';
import { cartManager } from '../app.js';

export const cartsRouter = Router()

cartsRouter.post('/', async (req,res) => {
    try {
        const response = await cartManager.addNewCart()
        res.json(response)
    } catch (error) {
        res.send('Error al agregar al carrito')
    }
 
})

cartsRouter.get('/:id', async (req,res) => {
    const { id } = req.params
    try {
        const response = await cartManager.getCartProducts(parseInt(id))
        res.send(response)      
    } catch (error) {
        res.send('error al ingresar productos al carrito')
    }
} )

cartsRouter.post('/:cid/product/:pid', async (req,res)  => {
    const { cid, pid } = req.params
    try {
        await cartManager.addProducttoCart(parseInt(cid),parseInt(pid))
        res.send('producto agregado al carrito')
    } catch (error) {
        res.send('Error al agregar productos al carrito')
    }
})