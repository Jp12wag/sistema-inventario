import React, { useState, useEffect } from 'react';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle'; // Importar Bootstrap
import { verAlerta } from './funciones'
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';




const VerProductos = () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id');
    const [productos, setProductos] = useState([]);
    const [cat, setCate] = useState([]);
    const [prove, setProve] = useState([]);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [categoría, setCategoria] = useState('');
    const [precio, setPrecio] = useState('');
    const [proveedor, setProveedor] = useState('');
    const [stockInicial, setStockInicial] = useState('');
    const [title, setTitle] = useState('');
    const [operacion, setOperacion] = useState(1);
    const [categoriaFiltro, setCategoriaFiltro] = useState('');


    useEffect(() => {
        getProductos();
        obtenerCategorias();
        obtenerProveedore();
    }, []);

    const obtenerCategorias = async () => {
        try {
            const response = await fetch('http://localhost:3001/categorias', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener las categorías');
            }
            const data = await response.json();
            setCate(data); // Actualizar el estado con las categorías obtenidas
        } catch (error) {
            console.error('Error al obtener las categorías:', error);
        }
    }

    const obtenerProveedore = async () => {
        try {
            const response = await fetch('http://localhost:3001/proveedores', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener las categorías');
            }
            const data = await response.json();
            setProve(data); // Actualizar el estado con las categorías obtenidas
        } catch (error) {
            console.error('Error al obtener las categorías:', error);
        }
    }


    const getProductos = async () => {
        try {
            const respuesta = await obtenerProductos(); // Esperar a que se resuelva la promesa
            setProductos(respuesta);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        }
    }

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

    let eliminarProductos = (id, name) => {
        const Myswal = withReactContent(Swal);
        Myswal.fire({
            title: '¿Estás seguro que quieres eliminar ' + name + ' el producto?',
            icon: 'question',
            text: 'No podrás revertir este paso',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                
                enviarSolicitud('DELETE', { id: id });
                getProductos();
            } else {
                verAlerta('El producto no fue eliminado', 'info');
            }
        });
    }


    const openModal = (op, id, name, descripcion, categoria, precio, proveedor, stockInicial) => {
        setId('');
        setName('');
        setDescripcion('');
        setCategoria('');
        setPrecio('');
        setProveedor('');
        setStockInicial('');

        setOperacion(op);
        if (op === 1) {
            setTitle('Registrar Producto');

        } else if (op === 2) {
            setTitle('Editar Producto');
            setId(id);
            setName(name);
            setDescripcion(descripcion);
            setCategoria(categoria);
            setPrecio(precio);
            setProveedor(proveedor);
            setStockInicial(stockInicial);
        }

        window.setTimeout(function () {
            document.getElementById('name').focus();
        }, 500);


    };

    const validar = () => {
        var parametros;
        var metodo;
        if (name.trim() === '') {
            verAlerta('Escribe el nombre del producto', 'warning');

        } else if (descripcion.trim() === '') {
            verAlerta('Escribe la descripcion del producto', 'warning');
        } else if (categoría === '') {
            verAlerta('Escribe la categoria del producto', 'warning');
        } else if (precio === '') {
            verAlerta('Escribe el precio del producto', 'warning');
        } else if (proveedor === '') {
            verAlerta('Escribe el proveedor del producto', 'warning');
        } else if (stockInicial === '') {
            verAlerta('Escribe el stock del producto', 'warning');
        } else {
            if (operacion === 1) {
                parametros = { name: name, descripcion: descripcion, categoría: categoría, precio: precio, proveedor: proveedor, stockInicial: stockInicial,fechaE:'',fechaS:'',owner: userId };
                metodo = 'POST'

            } else {
                parametros = { id: id, name: name, descripcion: descripcion, categoría: categoría, precio: precio, proveedor: proveedor, stockInicial: stockInicial };
                metodo = 'PUT'
            }
            enviarSolicitud(metodo, parametros);
        }

    }
    // Esto evita que la página se recargue al enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        validar();
    };


    // Función para filtrar los productos por categoría
    const filtrarPorCategoria = () => {
        return productos.filter(producto => producto.categoría.toLowerCase() === categoriaFiltro.toLowerCase());
    }

    // Manejar cambios en el input de búsqueda de categoría
    const handleChangeCategoria = (e) => {
        setCategoriaFiltro(e.target.value);
    }


    const enviarSolicitud = async (metodo, parametros) => {
        try {

            let url = 'http://localhost:3001/productos';
            if (parametros.id) {
                url += `/${parametros.id}`;
            }
            const response = await fetch(url, {
                method: `${metodo}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },

                body: JSON.stringify(parametros)
            });
            if (!response.ok) {
                throw new Error('Error al agregar el producto');
            }

            let tipo = '';
            if (response.status === 201) {
                tipo = 'success';
            } else {
                tipo = 'error';
            }
           

            if (tipo === 'success') {
                verAlerta("Registro Exitoso", tipo);
                document.getElementById('btnCerrar').click();
               
            }
            getProductos();

        } catch (error) {
            console.error('Error :', error);
        }

    }

    return (
        <div className='container'>
            <div className='row mt-3'>
                <div className='col-md-4 offset-md-4'>
                    <div className='d-grid mx-auto'>
                        <button className='btn btn-dark' onClick={() => openModal(1)} data-bs-toggle='modal' data-bs-target='#exampleModal'>
                            <FontAwesomeIcon icon={faPlusCircle} /> Añadir
                        </button>

                        <input id='search-bar' type='text' placeholder='Buscar por categoría' value={categoriaFiltro} onChange={handleChangeCategoria} />
                    </div>
                </div>
            </div>

            {
                <div className="modal" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">{title}</h5>
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
                                            <label htmlFor="descripcion" className="form-label">Descripción</label>
                                            <textarea className="form-control" id="descripcion" onChange={(e) => setDescripcion(e.target.value)} value={descripcion} placeholder="Descripción del Producto" required ></textarea>
                                        </div>
                                        {/*Prueba*/}
                                        <div className='mb-3'>
                                            <label htmlFor='categoría' className='form-label'>Categoría del Producto</label>
                                            <select className='form-select' id='categoría' onChange={(e) => setCategoria(e.target.value)} value={categoría} required>
                                                <option value=''>Seleccionar Categoría</option>
                                                {/* Renderizar las opciones de categoría */}
                                                {cat.map((categoría, index) => (
                                                    <option key={index} value={categoría.id}>{categoría.name}</option>

                                                ))}

                                            </select>
                                        </div>
                                        {/*fin de la prueba*/}

                                        <div className="mb-3">
                                            <label htmlFor="precio" className="form-label">Precio</label>
                                            <input type="number" className="form-control" id="precio" onChange={(e) => setPrecio(e.target.value)} value={precio} required placeholder="Precio del Producto" />
                                        </div>
                                        <select className='form-select' id='proveedor' onChange={(e) => setProveedor(e.target.value)} value={proveedor} required>
                                                <option value=''>Seleccionar Proveedor</option>
                                                {/* Renderizar las opciones de categoría */}
                                                {prove.map((proveedor, index) => (
                                                    <option key={index} value={proveedor.id}>{proveedor.name}</option>

                                                ))}

                                            </select>
                                        <div className="mb-3">
                                            <label htmlFor="stockInicial" className="form-label">Stock Inicial</label>
                                            <input type="number" className="form-control" id="stockInicial" onChange={(e) => setStockInicial(e.target.value)} value={stockInicial} required placeholder="Stock Inicial del Producto" />
                                        </div>

                                    </div>
                                    <div className='modal-footer'>
                                        <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Cancelar</button>
                                        <button type='submit' className='btn btn-primary' >Guardar</button>
                                    </div>
                                </form>




                            </div>

                        </div>
                    </div>
                </div>}

            <div className='row mt-3'>
                <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                    <div className='table-responsive'>
                        <table className='table table-bordered'>
                            {/* Encabezado de la tabla */}
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>PRODUCTOS</th>
                                    <th>DESCRIPCION</th>
                                    <th>CATEGORIA</th>
                                    <th>PRECIO</th>
                                    <th>PROVEEDOR</th>
                                    <th>CANTIDAD</th>
                                    <th>ACCIONES</th>
                                </tr>
                            </thead>

                                {/* Cuerpo de la tabla */}
                                <tbody>
                                    {/* Utiliza la función de filtrado si hay una categoría seleccionada, de lo contrario, muestra todos los productos */}
                                    {categoriaFiltro ? filtrarPorCategoria().map((producto, index) => (
                                        <tr key={producto._id}>
                                            <td>{index + 1}</td>
                                            <td>{producto.name}</td>
                                            <td>{producto.descripcion}</td>
                                            <td>{producto.categoría}</td>
                                            <td>{new Intl.NumberFormat('es-RD').format(producto.precio)}</td>
                                            <td>{producto.proveedor}</td>
                                            <td>{producto.stockInicial}</td>
                                            <td>
                                                <button onClick={() => openModal(2, producto._id, producto.name, producto.descripcion, producto.categoria, producto.precio, producto.proveedor, producto.stockInicial)} className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#exampleModal' >
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </button>
                                                <button className='btn btn-danger' onClick={() => eliminarProductos(producto._id, producto.name)}>
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : productos.map((producto, index) => (
                                        <tr key={producto._id}>
                                            <td>{index + 1}</td>
                                            <td>{producto.name}</td>
                                            <td>{producto.descripcion}</td>
                                            <td>{producto.categoría}</td>
                                            <td>{new Intl.NumberFormat('es-RD').format(producto.precio)}</td>
                                            <td>{producto.proveedor}</td>
                                            <td>{producto.stockInicial}</td>
                                            <td>
                                                <button onClick={() => openModal(2, producto._id, producto.name, producto.descripcion, producto.categoria, producto.precio, producto.proveedor, producto.stockInicial)} className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#exampleModal' >
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </button>
                                                <button className='btn btn-danger' onClick={() => eliminarProductos(producto._id, producto.name)}>
                                                    <FontAwesomeIcon icon={faTrash} />
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
}




export default VerProductos;