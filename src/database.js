import mongoose from "mongoose"; 


mongoose.connect("mongodb+srv://eduardogalli89:coderhouse@cluster0.sk8uaq4.mongodb.net/ecommerce")
    .then( () => console.log("Conexion exitosa!")) 
    .catch( (error) => console.log("Error", error))