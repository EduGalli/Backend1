import CartRepository from "../repositories/cart.repository.js";

class CartService {
    async createCart() {
        return await CartRepository.createcart();
    }

    async getCartById(id) {
        return await CartRepository.getCartById(id);
    }

    async addProductToCart(cartId, productId, quantity) {
        return await CartRepository.addProductToCart(cartId, productId, quantity);
    }

    async removeProductFromCart(cartId, productId) {
        return await CartRepository.removeProductFromCart(cartId, productId);
    }

    async updateProductQuantity(cartId, productId, quantity) {
        return await CartRepository.updateProductQuantity(cartId, productId, quantity);
    }
}

export default new CartService();
