import React from 'react';
import './App.css';
import VentanaIniciSesion from './componentes/Inicio';
import Formulario from './componentes/Registro';
import VentanaPrincipal from './componentes/Principal';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Importa Routes en lugar de Switch
import Headers from './componentes/Header'
function App() {
  return (
    <Router>
      <Headers/>
      <div className="App">
        <div className='contenedor-principal'>
          <Routes>
            <Route path="/" element={<VentanaIniciSesion />} /> {/* Usa 'element' en lugar de 'component' */}
            <Route path="/registro" element={<Formulario />} /> {/* Usa 'element' en lugar de 'component' */}
            <Route path="/principal" element={<VentanaPrincipal/>} /> {/* Usa 'element' en lugar de 'component' */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;