import ProductService from "../services/product.service.js";
import jwt from "jsonwebtoken";

class ProductController {
    async createProduct(req, res) {
        const productData = req.body;
        const token = req.cookies.coderCookieToken;

        try {
           
            jwt.verify(token, process.env.JWT_SECRET);
            const product = await ProductService.createProduct(productData);
            res.status(201).json(product); 
        } catch (error) {
            res.status(401).send("No autorizado");
        }
    }

    async getProductById(req, res) {
        const { id } = req.params;

        try {
            const product = await ProductService.getProductById(id);
            if (!product) {
                return res.status(404).send("Producto no encontrado");
            }
            res.json(product);
        } catch (error) {
            res.status(500).send("Error al obtener el producto");
        }
    }

    async getAllProducts(req, res) {
        const options = req.query; 

        try {
            const products = await ProductService.getAllProducts(options);
            res.json(products);
        } catch (error) {
            res.status(500).send("Error al obtener los productos");
        }
    }

    async updateProduct(req, res) {
        const { id } = req.params;
        const productData = req.body;
        const token = req.cookies.coderCookieToken;

        try {
           
            jwt.verify(token, process.env.JWT_SECRET);
            const updatedProduct = await ProductService.updateProduct(id, productData);
            if (!updatedProduct) {
                return res.status(404).send("Producto no encontrado");
            }
            res.json(updatedProduct);
        } catch (error) {
            res.status(401).send("No autorizado");
        }
    }

    async deleteProduct(req, res) {
        const { id } = req.params;
        const token = req.cookies.coderCookieToken;

        try {
            
            jwt.verify(token, process.env.JWT_SECRET);
            await ProductService.deleteProduct(id);
            res.send("Producto eliminado");
        } catch (error) {
            res.status(401).send("No autorizado");
        }
    }
}

export default new ProductController();