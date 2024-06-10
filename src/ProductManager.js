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
            console.log(`There was an error when trying to add product`,error)
            return(`There was an error when trying to add product`)
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
                console.log('Product not found: ',productFind)
            } else {
                console.error("Product not found -  getProductbyid.")
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
                // I clone the product to modify so as not to touch the origin
                const updateProduct = {...productsArray[pos]}
                // I update only fields that I received
                for (const key in productChange) {
                    if (key !== 'id') {
                        updateProduct[key] = productChange[key]      
                    }
                }
                productsArray[pos] = updateProduct
                await this.saveFile(productsArray);              
                console.log('Product updated: ',updateProduct)
                return
            } else {
                console.log('Product Not found to update')
                return('Error, product not found')
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
                return ('Poduct not found')
            }
            await this.saveFile(productsArray)
            console.log(`Product with id ${productId} has been successfully removed.`)
            return('Product removed OK')
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
            return('File recorded successfully')
        } catch (error) {
            console.log(`File recording error ${this.path}`, error);
            return(error)
        }
    }

    readFile = async () => {
        try {
            const response = await fs.readFile(this.path, "utf-8");
            // convert JSON array will be parsed into a JavaScript array
            return JSON.parse(response);
        } catch (error) {
            console.log(`Error reading file ${this.path}`, error);
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