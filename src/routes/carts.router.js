import express from 'express';
const router = express.Router();
import CartManager from '../dao/db/cart-manager-db.js';
const cartManager = new CartManager();


router.post('/', async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.crearCarrito();
        res.json(nuevoCarrito);
    } catch (error) {
        console.error('Error al crear un nuevo carrito', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try {
        const carrito = await cartManager.getCarritoById(cartId);
        res.json(carrito.products);
    } catch (error) {
        console.error('Error al obtener el carrito', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const actualizarCarrito = await cartManager.agregarProductoAlCarrito(cartId, productId, quantity);
        res.json(actualizarCarrito.products);
    } catch (error) {
        console.error('Error al agregar producto al carrito', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const carrito = await cartManager.getCarritoById(cid);
        if (!carrito) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

       
        carrito.products = carrito.products.filter(item => item.product.toString() !== pid);

        await carrito.save();
        return res.json(carrito.products);
    } catch (error) {
        console.error('Error al eliminar producto del carrito', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});


router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;

    try {
        const carrito = await cartManager.getCarritoById(cid);
        if (!carrito) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        
        carrito.products = products;

        await carrito.save();
        return res.json(carrito.products);
    } catch (error) {
        console.error('Error al actualizar carrito con nuevos productos', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});


router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const carrito = await cartManager.getCarritoById(cid);
        if (!carrito) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        
        const producto = carrito.products.find(item => item.product.toString() === pid);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }

        producto.quantity = quantity;

        await carrito.save();
        return res.json(carrito.products);
    } catch (error) {
        console.error('Error al actualizar cantidad del producto en el carrito', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});


router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const carrito = await cartManager.getCarritoById(cid);
        if (!carrito) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        carrito.products = [];

        await carrito.save();
        return res.json(carrito.products);
    } catch (error) {
        console.error('Error al eliminar todos los productos del carrito', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

import ProductModel from "../dao/models/product.model.js";
import UsuarioModel from "../dao/models/user.model.js";
import TicketModel from "../dao/models/tickets.model.js";
import { calcularTotal } from "../util/util.js";

router.get("/:cid/purchase", async (req, res) => {
    const carritoId = req.params.cid;
    try {
        const carrito = await CartModel.findById(carritoId);
        const arrayProductos = carrito.products;

        const productosNoDisponibles = [];

        for (const item of arrayProductos) {
            const productId = item.product;
            const product = await ProductModel.findById(productId);
            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await product.save();
            } else {
                productosNoDisponibles.push(productId);
            }
        }

        const usuarioDelCarrito = await UsuarioModel.findOne({cart: carritoId});

        const ticket = new TicketModel({
            purchase_datetime: new Date(), 
            amount: calcularTotal(carrito.products),
            purchaser: usuarioDelCarrito.email
        })

        await ticket.save(); 

        carrito.products = carrito.products.filter(item => productosNoDisponibles.some(productoId => productoId.equals(item.product))); 

        await carrito.save(); 

        //Testeamos con Postman: 
        res.json({
            message: "Compra generada",
            ticket: {
                id: ticket._id,
                amount: ticket.amount,
                purchaser: ticket.purchaser
            }, 
            productosNoDisponibles
        })

    } catch (error) {
        res.status(500).send("Error fatal");
    }
})

export default router;