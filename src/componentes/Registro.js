import React, { useState } from 'react';
import '../stylesheet/Registro.css';


function Formulario() {
    const [formData, setFormData] = useState({
        name: '',
        password: '',
        email: ''
    });

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (formData.email.trim() === '' || formData.password.trim() === '' ||formData.name.trim() === '') {
            alert('Por favor, completa todos los campos.');
            return;
          }
      


        try {
            const response = await fetch('http://localhost:3001/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Error al enviar el formulario');
            }
            alert("Registro Exitoso");
            console.log('Formulario enviado exitosamente');

            // Limpiar campos
            setFormData({
                name: '',
                password: '',
                email: ''
            });
            window.location.href = '/'; 
           
        } catch (error) {
            console.error('Error:', error.message);
           
        }
    };

    return (
        <div className='contenedor-registro'>
        <form onSubmit={handleSubmit}>
            <label>
                Nombre:
                <input type="text" name="name" value={formData.name} placeholder='Ingrese su nombre' onChange={handleChange} />
            </label>
            <br />
            
            <label>
                Email:
                <input type="email" name="email" value={formData.email} placeholder='Ingrese su correo electronico' onChange={handleChange} />
            </label>
            <br/>
            <label>
                Contraseña:
                <input type="password" name="password" placeholder='Ingrese su contraseña' value={formData.password} onChange={handleChange} />
            </label>
            <br/>
            
            <button type="submit" id='btnRegistro'>Enviar</button>
        </form>
        </div>
    );
}

export default Formulario;