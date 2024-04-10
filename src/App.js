import React from 'react';
import './App.css';
import VentanaIniciSesion from './componentes/Inicio';
import Principal from './componentes/Principal';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Importa Routes en lugar de Switch
import Categorias from './componentes/Categoria'
import Productos from './componentes/Productos'
import Registro from './componentes/Registro'
import Proveedor from './componentes/Proveedor'
import Ubicaciones from './componentes/Ubicaciones'
import Stock from './componentes/Stock'

function App() {
  return (
    <Router>

      <div className="App">
        <div className='contenedor-principal'>
          <Routes>
            <Route path='/' element={<VentanaIniciSesion />}></Route>
            <Route path='/Productos' element={<Productos />}></Route>
            <Route path='/Principal' element={<Principal />}></Route>
            <Route path='/Categorias' element={<Categorias />}></Route>
            <Route path='/Registro' element={<Registro />}></Route>
            <Route path='/Proveedores' element={<Proveedor />}></Route>
            <Route path='/Ubicaciones' element={<Ubicaciones />}></Route>
            <Route path='/Stock' element={<Stock />}></Route>
          </Routes>

        </div>
      </div>

    </Router>
  );
}

export default App;