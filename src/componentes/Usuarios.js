import React from "react";

function Usuarios(){
    async function obtenerUsuarios() {
        try {
            const response = await fetch('http://localhost:3001/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error de la red');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

     // Llamada a la función asíncrona y actualización del estado
     async function cargarProductos() {
        try {
            const usuarios = await obtenerUsuarios();
            setProductos(usuarios);
        } catch (error) {
            // Manejar errores, si es necesario
        }
    }





return(
    <div className="usuariosRegistrado">



    </div>



);



}

export default Usuarios;