import React from "react";
import '../stylesheet/Inicio.css'


function VentanaIniciSesion(){

    return(
        <div className="contenedor-Inicio">
            <label for='usuario'>Usuario<input  id='usuario' placeholder="Usuario"></input></label>
            <label for='pass'>Usuario<input  id='pass' placeholder="Contraseña"></input></label>
            <button>Login</button>
            <label className='registrase'><a href='#'>Registrarse</a></label>
        </div>


    );
}

export default VentanaIniciSesion;