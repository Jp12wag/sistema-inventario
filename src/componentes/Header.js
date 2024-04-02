import React, {useState} from "react";
import Logo from '../componentes/Logo'
import '../stylesheet/Headers.css'
import { Link } from 'react-router-dom'

function Header() {

    const [listaActiva, setListaActiva] = useState('Inicio');

     // Función para manejar el clic en el enlace "Inicio"
     const handleInicioClick = (opcion) => {
        setListaActiva(opcion);
    };

    return (
        <header className="header-container">
        <nav><Logo/></nav>
        <nav>
            <ul className={listaActiva === 'Inicio' ? 'habilitado' : 'Inhabilitado'}>
                <Link to="/" onClick={() => handleInicioClick('Inicio')}>Inicio</Link>
            </ul>
        </nav>
        {/* Aquí agregas otras listas de navegación */}
        <nav><ul className={listaActiva === 'Productos' ? 'habilitado' : 'Inhabilitado'}>  <Link to="/" onClick={() => handleInicioClick('Inicio')}>Productos</Link></ul></nav>
        <nav><ul className={listaActiva === 'Categorias' ? 'habilitado' : 'Inhabilitado'}>  <Link to="/Productos" onClick={() => handleInicioClick('Productos')}>Categorias</Link></ul></nav>
        <nav><ul className={listaActiva === 'Proveedores' ? 'habilitado' : 'Inhabilitado'}>  <Link to="/Categorias" onClick={() => handleInicioClick('Categorias')}>Proveedores</Link></ul></nav>
        <nav><ul className={listaActiva === 'Ubicaciones' ? 'habilitado' : 'Inhabilitado'}>  <Link to="/Ubicaciones" onClick={() => handleInicioClick('Ubicaciones')}>Ubicaciones</Link></ul></nav>
        <nav><ul className={listaActiva === 'Staock' ? 'habilitado' : 'Inhabilitado'}> <Link to="/Stock" onClick={() => handleInicioClick('Stock')}>Stock</Link></ul></nav>
        <nav><ul className={listaActiva === 'Entrada' ? 'habilitado' : 'Inhabilitado'}> <Link to="/Entrada" onClick={() => handleInicioClick('Entrada')}>Entrada</Link></ul></nav>
        <nav><ul className={listaActiva === 'Salida' ? 'habilitado' : 'Inhabilitado'}> <Link to="/Salida" onClick={() => handleInicioClick('Salida')}>Salida</Link></ul></nav>
        <nav><ul className={listaActiva === 'Administracion' ? 'habilitado' : 'Inhabilitado'}> <Link to="/Adminstracion"onClick={() => handleInicioClick('Adminstracion')}>Adminstracion</Link></ul></nav>
    </header>
);
}

export default Header;