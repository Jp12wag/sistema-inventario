import React, { useState, useEffect } from 'react';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle'; // Importar Bootstrap
import { verAlerta } from './funciones'
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';


const VerUbicaciones = () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id');
    const [id, setId] = useState('');
    const [Ubicaciones, setUbicaciones] = useState([]);
    const [name, setName] = useState();
    const [descripcion, setDescripcion] = useState();
    const [tipo, setTipo] = useState();
    const [title, setTitle] = useState('');
    const [operacion, setOperacion] = useState(1);
    const [UbicacionesFiltro, setUbicacionesFiltro] = useState('');


    useEffect(() => {
        getUbicaciones();
    }, []);

    const getUbicaciones = async () => {
        try {
            const respuesta = await obtenerUbicacioness(); // Esperar a que se resuelva la promesa
            setUbicaciones(respuesta);
        } catch (error) {
            console.error('Error al obtener las Ubicacioness:', error);
        }
    }

    async function obtenerUbicacioness() {
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

    let eliminarUbicaciones = (id, name) => {
        const Myswal = withReactContent(Swal);
        Myswal.fire({
            title: '¿Estás seguro que quieres eliminar ' + name + ' el Ubicaciones?',
            icon: 'question',
            text: 'No podrás revertir este paso',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {

                enviarSolicitud('DELETE', { id: id });
                getUbicaciones();
            } else {
                verAlerta('El Ubicaciones no fue eliminado', 'info');
            }
        });
    }


    const openModal = (op, id, name, descripcion, tipo) => {
        setId('');
        setName('');
        setDescripcion('');
        setTipo('');

        setOperacion(op);
        if (op === 1) {
            setTitle('Registrar Ubicaciones');

        } else if (op === 2) {
            setTitle('Editar Ubicaciones');
            setId(id);
            setName(name);
            setDescripcion(descripcion);
            setTipo(tipo);

        }

        window.setTimeout(function () {
            document.getElementById('name').focus();
        }, 500);


    };

    const validar = () => {
        var parametros;
        var metodo;
        if (name.trim() === '') {
            verAlerta('Escribe el nombre de la Ubicaciones', 'warning');

        } else if (descripcion.trim() === '') {
            verAlerta('Escribe la descripcion dela Ubicaciones', 'warning');
        } else if (tipo.trim() === '') {
            verAlerta('Escribe eel tipo  de Ubicaciones', 'warning');
        } else {
            if (operacion === 1) {
                parametros = { name: name, descripcion: descripcion, tipo: tipo, owner: userId };
                metodo = 'POST'

            } else {
                parametros = { id: id, name: name, descripcion: descripcion, tipo: tipo };
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

    // Función para filtrar los Ubicacioness por categoría
    const filtrarPorUbicaciones = () => {
        return Ubicaciones.filter(Ubicaciones => Ubicaciones.tipo.toLowerCase().trim() === UbicacionesFiltro.toLowerCase().trim());
    }

    // Manejar cambios en el input de búsqueda de categoría
    const handleChangeUbicaciones = (e) => {
        setUbicacionesFiltro(e.target.value);
    }



    const enviarSolicitud = async (metodo, parametros) => {
        try {

            let url = 'http://localhost:3001/Ubicaciones';
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
                throw new Error('Error al agregar la Ubicaciones');
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
            getUbicaciones();

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

                        <input id='search-bar' type='text' placeholder='Buscar por tipo' value={UbicacionesFiltro} onChange={handleChangeUbicaciones} />
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
                                            <label htmlFor='name' className='form-label'>Nombre de la Ubicaciones</label>
                                            <input type='text' className='form-control' id='name' onChange={(e) => setName(e.target.value)} value={name} required />
                                        </div>
                                        {/* Agrega los demás campos del formulario aquí */}
                                        <div className="mb-3">
                                            <label htmlFor="descripcion" className="form-label">Descripción</label>
                                            <textarea className="form-control" id="descripcion" onChange={(e) => setDescripcion(e.target.value)} value={descripcion} placeholder="Descripción del Ubicaciones" required ></textarea>
                                        </div>
                                        <select className='form-select' id='proveedor' onChange={(e) => setTipo(e.target.value)} value={tipo} required>
                                            <option value=''>Seleccionar Tipo</option>
                                            <option value='Tienda'>Tienda</option>
                                            <option value='Almacen'>Almacen</option>
                                            <option value='Colmado'>Colmado</option>

                                        </select>
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
                                    <th>UBICACIONES</th>
                                    <th>DESCRIPCION</th>
                                    <th>TIPO</th>
                                    <th>ACCIONES</th>
                                </tr>
                            </thead>

                            {/* Cuerpo de la tabla */}
                            <tbody>
                                {/* Utiliza la función de filtrado si hay una categoría seleccionada, de lo contrario, muestra todos los Ubicacioness */}
                                {UbicacionesFiltro ? filtrarPorUbicaciones().map((Ubicaciones, index) => (
                                    <tr key={Ubicaciones._id}>
                                        <td>{index + 1}</td>
                                        <td>{Ubicaciones.name}</td>
                                        <td>{Ubicaciones.descripcion}</td>
                                        <td>{Ubicaciones.tipo}</td>

                                        <td>
                                            <button onClick={() => openModal(2, Ubicaciones._id, Ubicaciones.name, Ubicaciones.descripcion, Ubicaciones.tipo)} className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#exampleModal' >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button className='btn btn-danger' onClick={() => eliminarUbicaciones(Ubicaciones._id, Ubicaciones.name)}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    </tr>
                                )) : Ubicaciones.map((Ubicaciones, index) => (
                                    <tr key={Ubicaciones._id}>
                                        <td>{index + 1}</td>
                                        <td>{Ubicaciones.name}</td>
                                        <td>{Ubicaciones.descripcion}</td>
                                        <td>{Ubicaciones.tipo}</td>
                                        <td>
                                            <button onClick={() => openModal(2, Ubicaciones._id, Ubicaciones.name, Ubicaciones.descripcion, Ubicaciones.tipo)} className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#exampleModal' >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button className='btn btn-danger' onClick={() => eliminarUbicaciones(Ubicaciones._id, Ubicaciones.name)}>
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




export default VerUbicaciones;