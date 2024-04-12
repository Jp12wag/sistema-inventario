import React, { useState } from "react";
import '../stylesheet/Aside.css'
import { Link } from 'react-router-dom'


function Aside() {
    const [login, setLogin] = useState(false);



    const cerrarSesion = () => {
        
        setLogin(false);
        localStorage.clear();
        window.location.href = '/';
        console.log(localStorage.getItem('token'));
       
    };

    if(!login){
        return (

            <aside>
                <ul>
                    
                    <li>
                        <Link to="/Productos">
                            <button id="BotonDeContenido1">Gestión de Productos</button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/Categorias">
                            <button id="BotonDeContenido1">Gestión de Categorias</button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/Proveedores">
                            <button id="BotonDeContenido1">Gestión de Proveedores</button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/Ubicaciones">
                            <button id="BotonDeContenido1">Gestión de Ubicaciones</button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/Stock">
                            <button id="BotonDeContenido1">Gestión de Stock</button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/Reportes">
                            <button id="BotonDeContenido1">Gestión de Reportes</button>
                        </Link>
                    </li>
                    <li>
                    <Link>
                    <button id="cerrarSesion" onSubmit={true} onClick={cerrarSesion}>Cerrar Sesion</button>
                    </Link>
                    </li>
                </ul>
            </aside>
        );
    }else{
        return (

            <aside>
                <ul>
                    <li>
                        <Link to="/">
                            <button id="inicio">Inicio</button>
                        </Link>
                    </li>
                  
                </ul>
            </aside>
        );
    }

    
}


export default Aside;

