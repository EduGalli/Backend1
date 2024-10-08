import ProductModel from "./models/product.model.js";

class ProductDao {
    async findById(id) {
        try {
            return await ProductModel.findById(id);
        } catch (error) {
            throw new Error(`Error de búsqueda de producto por ID: ${error.message}`);
        }
    }

    async findAll(options = {}) {
        try {
            return await ProductModel.paginate({}, options);
        } catch (error) {
            throw new Error(`Error al recuperar producto: ${error.message}`);
        }
    }

    async save(productData) {
        try {
            const product = new ProductModel(productData);
            return await product.save();
        } catch (error) {
            throw new Error(`Error guardando producto: ${error.message}`);
        }
    }

    async update(id, productData) {
        try {
            return await ProductModel.findByIdAndUpdate(id, productData, { new: true });
        } catch (error) {
            throw new Error(`Error actualizando producto: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            return await ProductModel.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Error eliminando producto: ${error.message}`);
        }
    }
}

export default new ProductDao();