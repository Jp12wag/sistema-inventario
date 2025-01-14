import React, { useState, useEffect } from 'react';
import '../stylesheet/salida.css';

function SalidaHistorial() {
    const [salidas, setSalidas] = useState([]);
    const [filtro, setFiltro] = useState({ fechaInicio: '', fechaFin: '' });
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        cargarSalidas();
    }, [filtro]);

    async function cargarSalidas() {
        try {
            const query = new URLSearchParams({
                fechaInicio: filtro.fechaInicio,
                fechaFin: filtro.fechaFin
            }).toString();

            const response = await fetch(`http://localhost:3001/salidas?${query}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            // Usando un bucle for...in
            for (let producto in data) {
                console.log(`${producto}: ${data[producto].producto}`);
                
            }

            if (Array.isArray(data)) {
                console.log(data.producto)
                setSalidas(data);
            } else {
                setSalidas([]);
                console.error('La respuesta no es un array:', data);
            }
        } catch (error) {
            console.error('Error al cargar las salidas:', error);
            setError('No se pudo cargar el historial de salidas.');
        }
    }

    function handleFiltroChange(e) {
        setFiltro({
            ...filtro,
            [e.target.name]: e.target.value
        });
    }

    return (
        <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <h2>Historial de Salidas de Stock</h2>
            <div>
                <label>
                    Fecha Inicio:
                    <input type="date" name="fechaInicio" value={filtro.fechaInicio} onChange={handleFiltroChange} />
                </label>
                <label>
                    Fecha Fin:
                    <input type="date" name="fechaFin" value={filtro.fechaFin} onChange={handleFiltroChange} />
                </label>
                <button onClick={cargarSalidas}>Generar Reporte</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Ubicación</th>
                        <th>Cliente</th>
                        <th>Comentarios</th>
                        <th>Precio de Venta</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {salidas.map(salida => (
                        <tr key={salida._id}>
                            <td>{salida.producto}</td>
                            <td>{salida.cantidad}</td>
                            <td>{salida.ubicación}</td>
                            <td>{salida.cliente}</td>
                            <td>{salida.comentarios}</td>
                            <td>{salida.precioDeVenta}</td>
                            <td>{new Date(salida.fecha).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SalidaHistorial;
