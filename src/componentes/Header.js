import React, {useState} from "react";
import Logo from '../componentes/Logo'
import '../stylesheet/Headers.css'
import { Link } from 'react-router-dom'

function Header({ handlePageChange, activePage }) {
    return (
        <header className="header-container">
            <nav><Logo/></nav>
            <nav>
                <ul className={activePage === 'Productos' ? 'active' : ''}>
                    <Link to="/Productos" onClick={() => handlePageChange('Productos')}>Gestión de Productos</Link>
                </ul>
                <ul className={activePage === 'Categorias' ? 'active' : ''}>
                    <Link to="/Categorias" onClick={() => handlePageChange('Categorias')}>Gestión de Categorias</Link>
                </ul>
                <ul className={activePage === 'Proveedores' ? 'active' : ''}>
                    <Link to="/Proveedores" onClick={() => handlePageChange('Proveedores')}>Gestión de Proveedores</Link>
                </ul>
                <ul className={activePage === 'Ubicaciones' ? 'active' : ''}>
                    <Link to="/Ubicaciones" onClick={() => handlePageChange('Ubicaciones')}>Gestión de Ubicaciones</Link>
                </ul>

                <ul className={activePage === 'Stock' ? 'active' : ''}>
                    <Link to="/Stock" onClick={() => handlePageChange('Stock')}>Gestión de Stock</Link>
                </ul>
            </nav>
            {/* Agrega el resto de los elementos de navegación aquí */}
        </header>
    );
}

export default Header;