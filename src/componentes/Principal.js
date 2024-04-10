import React, {useState} from 'react';
import '../stylesheet/Principal.css';
import Headers from '../componentes/Header';
function VentanaPrincipal() {
    const [activePage, setActivePage] = useState('Productos');
    const handlePageChange = (page) => {
        setActivePage(page);
    };
    return (
        <div>
            <Headers handlePageChange={handlePageChange} activePage={activePage} />
            <div className="contenedorPrincipal" id='contenedorValores'>
                {/* Aquí puedes cargar el contenido de la página seleccionada */}
                {activePage === 'Productos'}
                {/* Agrega el contenido de las otras páginas aquí */}
            </div>
        </div>
    );





}

export default VentanaPrincipal;

