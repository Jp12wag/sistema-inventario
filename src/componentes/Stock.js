import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle'; // Importar Bootstrap
import { verAlerta } from './funciones'



const StockManagement = () => {
    const [productos, setProductos] = useState([]);
    const token = localStorage.getItem('token');
    const [stockInicial, setStockInicial] = useState('');
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [precio, setPrecio] = useState('');
    const [operacion, setOperacion] = useState(2);
    const [cantidad, setCantidad] = useState();
    const [cliente, setCliente] = useState();
    const [ubic, setUbica] = useState('');
    const [salidas, setSalidas] = useState([]);
    const [title, setTitle] = useState('');
    const [Estado, setEstado] = useState(1);
    const stockInicialHabilitado = false;


    useEffect(() => {
        // Cargar productos al montar el componente
        cargarProductos();
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





    const openModal = (op, id, name, stockInicial, ubicacion, precio, cliente) => {
        setId('');
        setName('');
        setStockInicial('');
        setUbica('');
        setPrecio('');
        setCliente('');

        setOperacion(op);
        if (op === 2) {
            setTitle('Entrada');
            setId(id);
            setName(name);
            setStockInicial(stockInicial);
            setUbica(ubicacion);
        } else if (op === 1) {
            setTitle('Salida');
            setId(id);
            setName(name);
            setCantidad(stockInicial);
            setUbica(ubicacion);
            setPrecio(precio);
            setCliente(cliente);
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
            const fechaUpdate = new Date();
            const producto = productos.find(producto => producto._id === productoId);
            const StockAcumulado = parseInt(producto.stockInicial) + parseInt(stockInicial);
            console.log('El id que llego: ' + StockAcumulado);

            const parametros = { fecha: fechaUpdate, cantidad: StockAcumulado, producto: productoId, ubicacion: ubic };
            const parametrosDados = { fecha: fechaUpdate, cantidad: stockInicial, producto: productoId, ubicacion: ubic };
            if (!producto.fechaUpdate) {
                // Realizar el PUT solo si la fecha de entrada está vacía

                const SoloFecha = parametros.fecha;
                const response = await fetch(`http://localhost:3001/productos/${productoId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ fechaUpdate: SoloFecha })
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
            const canti = cantidad;

            const producto = productos.find(producto => producto._id === productoId);
            validarSalida({ producto: productoId, cantidad: cantidad, ubicación: producto.ubicacion, cliente: cliente, precioDeVenta: producto.precio, fecha: fechaSalida }, producto.stockInicial);


        } catch (error) {
            console.error('Error al registrar la entrada:', error);
            // verAlerta('Error al registrar la entrada', 'error');
        }
    };


    const validarSalida = async (Parametros, stockInicial) => {
        try {


            // Verificar si la cantidad de productos a salir excede el stock inicial
            if (Parametros.cantidad > stockInicial) {
                verAlerta("No puedes hacer esta salida, excediste la cantidad de stock", "error");
            } else {
                // Calcular el nuevo stock después de la salida
                const nuevoStock = parseInt(stockInicial) - parseInt(Parametros.cantidad);
                console.log(nuevoStock + '=' + stockInicial + '-' + Parametros.cantidad)
                // Realizar una solicitud PUT para actualizar el stock del producto
                const response = await fetch(`http://localhost:3001/productos/${Parametros.producto}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ stockInicial: nuevoStock, fechaS: Parametros.fecha })
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
                cargarProductos();
                document.getElementById('btnCerrar').click();
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
                                <h5 className="modal-title" id="exampleModalLabel">{title + ' De Stock' + id}</h5>
                                <button type="button" id='btnCerrar' className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className='modal-body'>

                                        <div className='mb-3'>
                                            <label htmlFor='name' className='form-label'>Nombre del Producto</label>
                                            <input type='text' className='form-control' id='name' disabled onChange={(e) => setName(e.target.value)} value={name} required />
                                        </div>
                                        {operacion === 2 && (
                                            <>
                                                <div className="mb-3">
                                                    <label htmlFor="stockInicial" className="form-label">Stock</label>
                                                    <input type="number" className="form-control" id="stockInicial" onChange={(e) => setStockInicial(e.target.value)} value={stockInicial} required placeholder="cantidad de Producto" />
                                                </div>
                                            </>
                                        )}
                                        {operacion === 1 && ( // Solo muestra estos campos si la operación es de salida
                                            <>
                                                <div className="mb-3">
                                                    <label htmlFor="stockInicial" className="form-label">Stock:{stockInicial}</label>
                                                    <input type="number" className="form-control" id="stockInicial" onChange={(e) => setCantidad(e.target.value)} value={cantidad} required placeholder="cantidad de Producto" />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="cliente" className="form-label">Cliente</label>
                                                    <input type="text" className="form-control" id="cliente" onChange={(e) => setCliente(e.target.value)} value={cliente} required placeholder="Nombre del Cliente" />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="precio" className="form-label">Valor del producto</label>
                                                    <input type="number" className="form-control" id="precio" disabled onChange={(e) => setPrecio(e.target.value)} value={precio} required placeholder="Precio del Producto" />
                                                </div>

                                            </>
                                        )}
                                    </div>
                                    <div className='modal-footer'>
                                        <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Cancelar</button>
                                        {operacion === 1 ? (
                                            <button type='submit' className='btn btn-primary' onClick={() => registrarSalida(id)}>Guardar</button>
                                        ) : (
                                            <button type='submit' className='btn btn-primary' onClick={() => registrarEntrada(id)}>Guardar</button>
                                        )}
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>}

            <div className='row mt-4'>
                <div className='col-12'>
                    <div className='table-responsive overflow-auto'>
                        <table className='table table-bordered'>
                            {/* Encabezado de la tabla */}
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>PRODUCTOS</th>
                                    <th>COSTO</th>
                                    <th>PROVEEDOR</th>
                                    <th>CANTIDAD</th>
                                    <th>UBICACION</th>
                                    <th>FECHA ENTRADA</th>
                                    <th>FECHA UPDATE</th>
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
                                        <td>{producto.ubicacion}</td>
                                        <td>{producto.fechaE}</td>
                                        <td>{producto.fechaUpdate}</td>
                                        <td>{producto.fechaS}</td>
                                        <td>
                                            {producto.fechaUpdate === null && (
                                            <button className='btn btn-primary' data-bs-toggle='modal' data-bs-target='#exampleModal' onClick={() => openModal(2, producto._id, producto.name, producto.stockInicial, producto.ubicacion)}>Validar</button>
                                            )}
                                            {producto.fechaUpdate  && (
                                                <button className='btn btn-success' data-bs-toggle='modal' data-bs-target='#exampleModal' onClick={() => openModal(2, producto._id, producto.name, producto.stockInicial, producto.ubicacion)}>Entrada</button>
                                            )}
                                            {producto.fechaUpdate && (
                                                <button className='btn btn-danger' data-bs-toggle='modal' data-bs-target='#exampleModal' onClick={() => openModal(1, producto._id, producto.name, '', producto.ubicacion, producto.precio, '')} >Salida</button>
                                            )}
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
