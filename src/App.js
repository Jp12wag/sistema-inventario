import React from 'react';
import './App.css';
import VentanaIniciSesion from './componentes/Inicio';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Categorias from './componentes/Categoria';
import Productos from './componentes/Productos';
import Registro from './componentes/Registro';
import Proveedor from './componentes/Proveedor';
import Ubicaciones from './componentes/Ubicaciones';
import Stock from './componentes/Stock';
import Aside from './componentes/Aside';
import Header from './componentes/Header';
import Footer from './componentes/Footer';
import Reportes from './componentes/Reportes';
import Usuarios from './componentes/Usuarios';
import SalidaHistorial from './componentes/SalidaHistorial';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Header />
      {token ? <Aside /> : null}
      <div className={token ? 'contenedor-principal' : 'nuevoContenedor'}>
        <Routes>
          {!token ? (
            <>
              <Route path="/" element={<VentanaIniciSesion />} />
              <Route path="/Registro" element={<Registro />} />
            </>
          ) : (
            <>
              <Route path="/Productos" element={<Productos />} />
              <Route path="/Categorias" element={<Categorias />} />
              <Route path="/Proveedores" element={<Proveedor />} />
              <Route path="/Ubicaciones" element={<Ubicaciones />} />
              <Route path="/Stock" element={<Stock />} />
              <Route path="/Reportes" element={<Reportes />} />
              <Route path="/Usuarios" element={<Usuarios />} />
              <Route path="/Salida" element={<SalidaHistorial />} />
              <Route path="*" element={<Productos />} /> {/* Ruta por defecto para usuarios autenticados */}
            </>
          )}
        </Routes>
      </div>

      <Footer />
    </Router>
  );
}

export default App;
