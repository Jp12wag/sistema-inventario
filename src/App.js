import React from 'react';
import './App.css';
import VentanaIniciSesion from './componentes/Inicio';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Importa Routes en lugar de Switch
import Categorias from './componentes/Categoria'
import Productos from './componentes/Productos'
import Registro from './componentes/Registro'
import Proveedor from './componentes/Proveedor'
import Ubicaciones from './componentes/Ubicaciones'
import Stock from './componentes/Stock'
import Aside from './componentes/Aside';
import Header from './componentes/Header'
import Footer from './componentes/Footer'
import Reportes from './componentes/Reportes';

function App() {
  const token = localStorage.getItem('token');
  if (!token) {

    return (
      <div className="App">
        <Router>
          <Header id='Header' />
          <div className='nuevoContenedor'>
            <Routes>
              <Route path='/' element={<VentanaIniciSesion />}></Route>
              <Route path='/Registro' element={<Registro />}></Route>
            </Routes>
          </div>

          <Footer id='Footer.js' />
        </Router>
      </div >
    );



  } else {
    return (
      <div className="App">
        <Router>
          <Header id='Header' />
          <Aside id='Aside' />

          <div className='contenedor-principal'>
            <Routes>
              <Route path='/' element={<VentanaIniciSesion />}></Route>
              <Route path='/Productos' element={<Productos />}></Route>
              <Route path='/Categorias' element={<Categorias />}></Route>
              <Route path='/Registro' element={<Registro />}></Route>
              <Route path='/Proveedores' element={<Proveedor />}></Route>
              <Route path='/Ubicaciones' element={<Ubicaciones />}></Route>
              <Route path='/Stock' element={<Stock />}></Route>
              <Route path='/Reportes' element={<Reportes/>}></Route>
            </Routes>
          </div>

          <Footer id='Footer.js' />
        </Router>
      </div >
    );
  }


}

export default App;