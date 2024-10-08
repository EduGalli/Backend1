import ProductRepository from "../repositories/product.repository.js";

class ProductService {
    async createProduct(productData) {
        return await ProductRepository.createProduct(productData);
    }

    async getProductById(id) {
        return await ProductRepository.getProductById(id);
    }

    async getAllProducts(options) {
        return await ProductRepository.getAllProducts(options);
    }

    async updateProduct(id, productData) {
        return await ProductRepository.updateProduct(id, productData);
    }

    async deleteProduct(id) {
        return await ProductRepository.deleteProduct(id);
    }
}

export default new ProductService();
