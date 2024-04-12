import React, { useState } from "react";
import Logo from '../componentes/Logo'
import '../stylesheet/Headers.css'

function Header() {
    const userName = localStorage.getItem('userName')

    return (
        <header className="header-container">
            <nav><Logo/></nav>
            {/* <!-- precentacion del sistema --> */}

            <h1>LogiVault</h1>

            <nav>
                <p id="NombreDeUsuario">{userName}</p>
            </nav>
            {/* Agrega el resto de los elementos de navegación aquí */}
        </header>
    );
}

export default Header;