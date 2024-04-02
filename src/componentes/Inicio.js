import React, { useState } from 'react';
import '../stylesheet/Inicio.css';
import { Link } from 'react-router-dom';

function VentanaIniciSesion() {
  const [formData, setFormData] = useState({
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

    if (formData.email.trim() === '' || formData.password.trim() === '') {
      alert('Por favor, completa todos los campos.');
      return;
    }


    fetch(' http://localhost:3001/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)

    }).then(response => {
      if (!response.ok) {
        throw new Error('Error al buscar usuario');
      }
      return response.json();

    }).then(data => {
      localStorage.setItem('token', data.token)
      console.log(localStorage);
      setFormData({
        password: '',
        email:''
    });
      window.location.href = '/principal'; 
    })
      .catch(error => {
        console.error('Error:', error.message);
      });



  }
  return (
    <form onSubmit={handleSubmit}>
      <div className='contenedor-Inicio'>
        <label htmlFor='email'>Email
          <input id='email' name='email' placeholder='Ingrese su correo electronico' onChange={handleChange}></input><br></br>
        </label>
        <label htmlFor='password'>Contraseña
          <input id='password' type="password"  name='password' placeholder='Contraseña' onChange={handleChange}></input>
        </label>
        <button type='submit'>Login</button>
        <label className='registrarse'><Link to="/registro">Registrarse</Link></label>
      </div>
    </form>
  )
}

export default VentanaIniciSesion;