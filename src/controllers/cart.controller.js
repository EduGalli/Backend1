import CartService from "../services/cart.service.js";
import jwt from "jsonwebtoken";

class CartController {
    async createCart(req, res) {
        try {
            const cart = await CartService.createCart();
            res.status(201).json(cart); 
        } catch (error) {
            res.status(500).send("Error al crear el carrito");
        }
    }

    async getCartById(req, res) {
        const { id } = req.params;
        const token = req.cookies.coderCookieToken;

        try {
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const cart = await CartService.getCartById(id);
            if (!cart) {
                return res.status(404).send("Carrito no encontrado");
            }
            res.json(cart);
        } catch (error) {
            res.status(401).send("No autorizado");
        }
    }

    async addProductToCart(req, res) {
        const { id: cartId } = req.params;
        const { productId, quantity } = req.body;
        const token = req.cookies.coderCookieToken;

        try {
            
            jwt.verify(token, process.env.JWT_SECRET);
            await CartService.addProductToCart(cartId, productId, quantity);
            res.send("Producto agregado al carrito");
        } catch (error) {
            res.status(401).send("No autorizado");
        }
    }

    async removeProductFromCart(req, res) {
        const { id: cartId, productId } = req.params;
        const token = req.cookies.coderCookieToken;

        try {
            
            jwt.verify(token, process.env.JWT_SECRET);
            await CartService.removeProductFromCart(cartId, productId);
            res.send("Producto eliminado del carrito");
        } catch (error) {
            res.status(401).send("No autorizado");
        }
    }

    async updateProductQuantity(req, res) {
        const { id: cartId, productId } = req.params;
        const { quantity } = req.body;
        const token = req.cookies.coderCookieToken;

        try {
            
            jwt.verify(token, process.env.JWT_SECRET);
            await CartService.updateProductQuantity(cartId, productId, quantity);
            res.send("Cantidad del producto actualizada");
        } catch (error) {
            res.status(401).send("No autorizado");
        }
    }
}

export default new CartController();