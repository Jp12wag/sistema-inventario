import React, { useState } from 'react';
import '../stylesheet/Inicio.css';
import { Link } from 'react-router-dom';
import logo from '../imagenes/Logo-clr-light.png'
import imgInicio from '../imagenes/img-login.png'

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
      localStorage.setItem('roles', data.user.roles)
      localStorage.setItem('id', data.user._id)

      setFormData({
        password: '',
        email: ''
      });


      if (!localStorage.getItem('token') || localStorage.getItem('roles') !== 'Administrador') {
        window.location.href = '/usuarioMenu';
      }else{
        window.location.href = '/Principal';
      }


    })
      .catch(error => {
        console.error('Error:', error.message);
      });



  }
  return (
    <form onSubmit={handleSubmit}>

      <div className='contenedor-inicio'>

        <div className='imagen-inicio'><img src={imgInicio} alt='imagen de inicio' /></div>
        <div className='log-info'>
          <img className='img-logo' src={logo} alt='logo app' />
          <label htmlFor='email'>Email
            <input id='email' name='email' placeholder='Ingrese su correo electronico' onChange={handleChange}></input><br></br>
          </label>
          <label id='pass' htmlFor='password'>Contraseña
            <input id='password' type="password" name='password' placeholder='Contraseña' onChange={handleChange}></input>
          </label>
          <div className='btn-submit'>
            <button className='btn-btn-submit' type='submit'>Login</button>


          </div>
          <label className='registrarse'>¿No tienes cuenta?</label>
          <Link className='registro' to="/Registro">Registrate aquí</Link>
        </div>

      </div>
      <div class="contenedor-footer">
        <footer class="footer">
          <p class="texto-footer"><i class="fa-regular fa-copyright" />Todos los derechos reservados a los creadores de LogiVault</p>
        </footer> </div>
    </form>
  )
}

export default VentanaIniciSesion;