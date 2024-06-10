import { promises as fs } from 'fs'

class ProductManager {

    constructor(path) {
        this.products = [],
        this.path = path
    }

    addProduct = async (product) => {
        try {
            
            let productsArray = await this.readFile(); 

            if ( !this.isValidObject(product)){
                console.error("All fields are required!")
                return
            }
            
            if(productsArray.some(item => item.code === product.code)) {
                console.error("The code field must be unique")
                return
            }

            const currentId = await this.lastProductId(productsArray)

            const newProduct = {
                id : currentId,
                title: product.title,
                description: product.description,
                price: product.price,
                thumbnails: product.thumbnails,
                code: product.code,
                stock: product.code,
                status: product.status,
                category: product.category
            }
            
            productsArray.push(newProduct)

            await this.saveFile(productsArray)

            return newProduct      

        } catch (error) {
            console.log(`Hubo un error al intentar agregar el producto`,error)
            return(`Hubo un error al intentar agregar el producto`)
        }
    } 

    getProducts = async() => {
        try {
            let productsArray = await this.readFile(); 
            return productsArray
        } catch (error) {
            return('Error: ',error)
        }
     }

    getProductById = async (id) => {
        try {
            const productsArray = await this.getProducts()
            const productFind = productsArray.find(prod => prod.id == id)
            if (productFind){
                console.log('Producto no encontrado: ',productFind)
            } else {
                console.error("Producto no encontrado -  getProductbyid.")
            }
        } catch (error) {
            return(`Error: ${error}`)
        }
    }

    updateProduct= async (id,productChange) => {
        try {
            let productsArray = await this.getProducts() 
            const pos = productsArray.findIndex(prod => prod.id === id)
            if ( pos != -1 ) {
                
                const updateProduct = {...productsArray[pos]}
                
                for (const key in productChange) {
                    if (key !== 'id') {
                        updateProduct[key] = productChange[key]      
                    }
                }
                productsArray[pos] = updateProduct
                await this.saveFile(productsArray);              
                console.log('Producto actualizado: ',updateProduct)
                return
            } else {
                console.log('No se encontro producto para actualizar')
                return('Error, producto no encontrado')
            }
        } catch (error) {
            return(error)
        }
    }

    deleteProduct = async (pid) => {
        try {
            let productsArray = await this.readFile(); 
            const pos = productsArray.findIndex(prod => prod.id === pid)
            if ( pos !== -1 ) {
                productsArray.splice(pos,1)
            }
            else {
                return ('Poducto no encontrado')
            }
            await this.saveFile(productsArray)
            console.log(`Producto con id ${productId} fue eliminado correctamente.`)
            return('Producto eliminado')
        } catch (error) {
            return(error)
        }
    }
   
    // aux internal metods

    isValidObject(objeto) {
        for (let property in objeto) {
          if (objeto.hasOwnProperty(property)) {
            if (objeto[property] === undefined || objeto[property] === null || objeto[property] === '') {
              return false; 
            }
          }
        }
        return true;
    }

    saveFile = async(productsArrays) => {
        try {
            await fs.writeFile(this.path, JSON.stringify(productsArrays, null, 2));
            return('Archivo guardado correctamente')
        } catch (error) {
            console.log(`Error al guardar archivo ${this.path}`, error);
            return(error)
        }
    }

    readFile = async () => {
        try {
            const response = await fs.readFile(this.path, "utf-8");
            
            return JSON.parse(response);
        } catch (error) {
            console.log(`Error al leer el archivo ${this.path}`, error);
        }
    }

    lastProductId = async (products) => {
        let lastId = 1
        if (products.length > 0) {
            const product = products.reduce((previous, current) => {
                return current.id > previous.id? current : previous;
              })
              console.log("product",product)
            lastId = product.id + 1
         }
        return lastId
    }

}

export { ProductManager }