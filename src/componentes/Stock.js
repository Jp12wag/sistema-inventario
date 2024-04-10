import React, { useState, useEffect } from 'react';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle'; // Importar Bootstrap
import { verAlerta } from './funciones'
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

const StockManagement = () => {
    const [productos, setProductos] = useState([]);
    const token = localStorage.getItem('token');
    const [stockInicial, setStockInicial] = useState('');
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [operacion, setOperacion] = useState(2);
    const [Ubicaciones, setUbicaciones] = useState([]);
    const [cantidad, setCantidad] = useState();
    const [cliente, setCliente] = useState();
    const [ubic, setUbica] = useState();
    const [salidas, setSalidas] = useState({
        producto: '',
        cantidad: '',
        ubicacion: '',
        cliente: '',
        precioDeVenta: '',
        fecha: ''
    });


    useEffect(() => {
        // Cargar productos al montar el componente
        cargarProductos();
        cargarUbicaciones();
    }, []);



    const cargarProductos = async () => {
        try {
            const productosData = await obtenerProductos();
            setProductos(productosData);
        } catch (error) {
            console.error('Error al cargar los productos:', error);
        }
    };

    async function obtenerProductos() {
        try {
            const response = await fetch('http://localhost:3001/productos', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error de la red');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    const cargarUbicaciones = async () => {
        try {
            const UbicacionesData = await obtenerUbicaciones();
            setUbicaciones(UbicacionesData);
        } catch (error) {
            console.error('Error al cargar los productos:', error);
        }
    };
    async function obtenerUbicaciones() {
        try {
            const response = await fetch('http://localhost:3001/Ubicaciones', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error de la red');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }


    const openModal = (op, id, name, stockInicial, ubicacion) => {
        setId('');
        setName('');
        setStockInicial('');
        setUbicaciones('');

        setOperacion(op);
        if (op === 2) {

            setId(id);
            setName(name);
            setStockInicial(stockInicial);
            setUbicaciones(ubicacion);
        }

        window.setTimeout(function () {
            document.getElementById('name').focus();
        }, 500);


    };
    // Esto evita que la página se recargue al enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

    };

    const RegistroEntrada = async (Parametros) => {
        try {
            const response = await fetch('http://localhost:3001/entradas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(Parametros)
            })

            if (!response.ok) {
                throw new Error('Error de la red');
            }
            verAlerta('Entrada Realizada con exito', 'success');
            document.getElementById('btnCerrar').click();
            cargarProductos();

        } catch (error) {
            console.log("Error", error);

        }



    }

    // Función para manejar la entrada de productos
    const registrarEntrada = async (productoId) => {
        try {
            // Obtener la fecha actual
            const fechaEntrada = new Date();
            const producto = productos.find(producto => producto._id === productoId);
            const StockAcumulado = parseInt(producto.stockInicial) + parseInt(stockInicial);
            const parametros = { fecha: fechaEntrada, cantidad: StockAcumulado, producto: productoId, ubicacion: ubic };
            const parametrosDados = { fecha: fechaEntrada, cantidad: stockInicial, producto: productoId, ubicacion: ubic };
            if (!producto.fechaE) {
                // Realizar el PUT solo si la fecha de entrada está vacía

                const SoloFecha = parametros.fecha;
                const response = await fetch(`http://localhost:3001/productos/${productoId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ fechaE: SoloFecha })
                });

                if (!response.ok) {
                    throw new Error('Error al actualizar la fecha de entrada del producto');
                }

                // Si la solicitud es exitosa, puedes mostrar una alerta o actualizar la lista de productos
                verAlerta('Fecha de entrada actualizada correctamente', 'success');
                cargarProductos();
                RegistroEntrada(parametrosDados);

            } else {
                // La fecha de entrada ya está registrada, no se realiza ninguna acción
                console.log('La fecha de entrada ya está registrada para este producto');

                const stockInicial = parametros.cantidad;
                const response = await fetch(`http://localhost:3001/productos/${productoId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ stockInicial: stockInicial })
                });

                if (!response.ok) {
                    throw new Error('Error al actualizar la fecha de entrada del producto');
                }

                RegistroEntrada(parametrosDados);
            }



        } catch (error) {
            // console.error('Error al registrar la entrada:', error);
            verAlerta('Error al registrar la entrada', 'error');
        }

    };


    // Función para manejar la salida de productos
    const registrarSalida = async (productoId) => {
        try {
            // Obtener la fecha actual
            const fechaSalida = new Date();
            const parametros = { fechaS: fechaSalida }
            const producto = productos.find(producto => producto._id === productoId);
            setSalidas({
                producto: productoId,
                cantidad: cantidad,
                ubicación: Ubicaciones._id,
                cliente: cliente,
                precioDeVenta: producto.precio,
                fecha: fechaSalida
            });

            console.log(salidas);
            if (!producto.fechaS) {
                // Realizar el PUT solo si la fecha de entrada está vacía
                const response = await fetch(`http://localhost:3001/productos/${productoId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(parametros)
                });

                if (!response.ok) {
                    throw new Error('Error al actualizar la fecha de entrada del producto');
                }

                // Si la solicitud es exitosa, puedes mostrar una alerta o actualizar la lista de productos
                verAlerta('Fecha de entrada actualizada correctamente', 'success');
                document.getElementById('btnCerrar').click();
                // validarSalida(salidas);
                cargarProductos();
            } else {
                // La fecha de entrada ya está registrada, no se realiza ninguna acción
                console.log('La fecha de entrada ya está registrada para este producto');
            }

        } catch (error) {
            // console.error('Error al registrar la entrada:', error);
            // verAlerta('Error al registrar la entrada', 'error');
        }
    };


    const validarSalida = async (Parametros) => {
        try {
            // Verificar si la cantidad de productos a salir excede el stock inicial
            if (Parametros.cantidad > productos.stockInicial) {
                verAlerta("No puedes hacer esta salida, valor excedido del inventario", "error");
            } else {
                // Calcular el nuevo stock después de la salida
                const nuevoStock = productos.stockInicial - Parametros.cantidad;

                // Realizar una solicitud PUT para actualizar el stock del producto
                const response = await fetch(`http://localhost:3001/productos/${productos.producto}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ stockInicial: nuevoStock })
                });

                if (!response.ok) {
                    throw new Error('Error al actualizar el stock del producto');
                }

                // Si la solicitud PUT es exitosa, realizar una solicitud POST para registrar la salida
                const salidaResponse = await fetch('http://localhost:3001/salidas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(Parametros)
                });

                if (!salidaResponse.ok) {
                    throw new Error('Error al registrar la salida');
                }

                // Mostrar una alerta o realizar otras acciones necesarias para indicar que la salida se ha realizado con éxito
                verAlerta('Salida registrada correctamente', 'success');
            }
        } catch (error) {
            console.error('Error al validar la salida:', error);
            // Mostrar una alerta de error u otras acciones necesarias
        }
    }
    return (
        <div className='container'>
            {
                <div className="modal" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Editar Stock</h5>
                                <button type="button" id='btnCerrar' className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className='modal-body'>
                                        <div className='mb-3'>
                                            <label htmlFor='name' className='form-label'>Nombre del Producto</label>
                                            <input type='text' className='form-control' id='name' onChange={(e) => setName(e.target.value)} value={name} required />
                                        </div>
                                        {/* Agrega los demás campos del formulario aquí */}

                                        <div className="mb-3">
                                            <label htmlFor="stockInicial" className="form-label">Stock</label>
                                            <input type="number" className="form-control" id="stockInicial" onChange={(e) => setStockInicial(e.target.value)} value={stockInicial} required placeholder="Stock Inicial del Producto" />
                                        </div>
                                        {/*Prueba*/}
                                        <div className='mb-3'>
                                            <label htmlFor='categoría' className='form-label'>Ubicaciones del Producto</label>
                                            <select className='form-select' id='categoría' onChange={(e) => setUbica(e.target.value)} value={ubic} required>
                                                <option value=''>Seleccionar Ubicaciones</option>
                                                {Ubicaciones && Array.isArray(Ubicaciones) && Ubicaciones.map((ubicacion, index) => (
                                                    <option key={index} value={ubicacion._id}>{ubicacion.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        {/*fin de la prueba*/}

                                    </div>
                                    <div className='modal-footer'>
                                        <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Cancelar</button>
                                        <button type='submit' className='btn btn-primary' onClick={() => registrarEntrada(id)}>Guardar</button>
                                    </div>
                                </form>




                            </div>

                        </div>
                    </div>
                </div>}









            <div className='row mt-4'>
                <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                    <div className='table-responsive'>
                        <table className='table table-bordered'>
                            {/* Encabezado de la tabla */}
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>PRODUCTOS</th>
                                    <th>PRECIO</th>
                                    <th>PROVEEDOR</th>
                                    <th>CANTIDAD</th>
                                    <th>FECHA ENTRADA</th>
                                    <th>FECHA SALIDA</th>
                                    <th>ACCIONES</th>

                                </tr>
                            </thead>


                            <tbody>
                                {/* Utiliza la función de filtrado si hay una categoría seleccionada, de lo contrario, muestra todos los productos */}
                                {productos.map((producto, index) => (
                                    <tr key={producto._id}>
                                        <td>{index + 1}</td>
                                        <td>{producto.name}</td>
                                        <td>{new Intl.NumberFormat('es-RD').format(producto.precio)}</td>
                                        <td>{producto.proveedor}</td>
                                        <td>{producto.stockInicial}</td>
                                        <td>{producto.fechaE}</td>
                                        <td>{producto.fechaS}</td>
                                        <td>
                                            <button className='btn btn-success' data-bs-toggle='modal' data-bs-target='#exampleModal' onClick={() => openModal(2, producto._id, producto.name, producto.stockInicial)}>Entrada</button>
                                            <button className='btn btn-danger' onClick={() => registrarSalida(producto._id)} disabled={!producto.fechaS}>Salida</button>
                                            <button className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#exampleModal' >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div >

    );
};

export default StockManagement;
