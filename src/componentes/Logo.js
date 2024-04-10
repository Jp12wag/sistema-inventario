import React from 'react';
import logo from '../imagenes/Logo-clr-light.png'
import '../stylesheet/Logo.css'

class Logo extends React.Component{



    render(){
        return(
             <div className='contenedor-imagenes'><img src={logo} alt='estos es una imagen de prueba'/></div>
        );
    }
}

export default Logo;