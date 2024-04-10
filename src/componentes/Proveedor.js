import React, { useState, useEffect } from 'react';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import { verAlerta } from './funciones'
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';


const VerProveedor = () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id');
    const [id, setId] = useState('');
    const [Proveedor, setProveedor] = useState([]);
    const [name, setName] = useState();
    const [contacto, setContacto] = useState();
    const [direccion, setDireccion] = useState();
    const [telefono, setTelefono] = useState();
    const [correo, setCorreo] = useState();
    const [title, setTitle] = useState('');
    const [operacion, setOperacion] = useState(1);
    const [ProveedorFiltro, setProveedorFiltro] = useState('');


    useEffect(() => {
        getProveedor();
    }, []);

    const getProveedor = async () => {
        try {
            const respuesta = await obtenerProveedors(); // Esperar a que se resuelva la promesa
            setProveedor(respuesta);
        } catch (error) {
            console.error('Error al obtener las Proveedors:', error);
        }
    }

    async function obtenerProveedors() {
        try {
            const response = await fetch('http://localhost:3001/proveedores', {
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

    let eliminarProveedor = (id, name) => {
        const Myswal = withReactContent(Swal);
        Myswal.fire({
            title: '¿Estás seguro que quieres eliminar ' + name + ' el Proveedor?',
            icon: 'question',
            text: 'No podrás revertir este paso',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {

                enviarSolicitud('DELETE', { id: id });
                getProveedor();
            } else {
                verAlerta('El Proveedor no fue eliminado', 'info');
            }
        });
    }


    const openModal = (op, id, name, contacto, telefono, correo) => {
        setId('');
        setName('');
        setContacto('');
        setDireccion('');
        setTelefono('');
        setCorreo('');

        setOperacion(op);
        if (op === 1) {
            setTitle('Registrar Proveedor');

        } else if (op === 2) {
            setTitle('Editar Proveedor');
            setId(id);
            setName(name);
            setContacto(contacto);
            setDireccion(direccion);
            setTelefono(telefono);
            setCorreo(correo);

        }

        window.setTimeout(function () {
            document.getElementById('name').focus();
        }, 500);


    };

    const validar = () => {
        var parametros;
        var metodo;
        if (name.trim() === '') {
            verAlerta('Escribe el nombre de la Proveedor', 'warning');

        } else if (contacto.trim() === '') {
            verAlerta('Escribe el contacto del Proveedor', 'warning');
        } else if (direccion.trim() === '') {
            verAlerta('Escribe la direccion del Proveedor', 'warning');
        } else if (telefono.trim() === '') {
            verAlerta('Escribe el telefono del Proveedor', 'warning');
        } else if (correo.trim() === '') {
            verAlerta('Escribe el correo del Proveedor', 'warning');
        } else {
            if (operacion === 1) {
                parametros = { name: name, contacto: contacto, direccion: direccion, telefono: telefono, correo: correo, owner: userId };
                metodo = 'POST'

            } else {
                parametros = { id: id, name: name, contacto: contacto, direccion: direccion, telefono: telefono, correo: correo };
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

    // Función para filtrar los Proveedors por categoría
    const filtrarPorProveedor = () => {
        return Proveedor.filter(Prove => Prove.contacto.toLowerCase().trim() === ProveedorFiltro.toLowerCase().trim());
    }

    // Manejar cambios en el input de búsqueda de categoría
    const handleChangeProveedor = (e) => {
        setProveedorFiltro(e.target.value);
    }



    const enviarSolicitud = async (metodo, parametros) => {
        try {

            let url = 'http://localhost:3001/proveedores';
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
                throw new Error('Error al agregar la Proveedor');
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
            getProveedor();

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

                        <input id='search-bar' type='text' placeholder='Buscar por categoría' value={ProveedorFiltro} onChange={handleChangeProveedor} />
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
                                            <label htmlFor='name' className='form-label'>Nombre de la Proveedor</label>
                                            <input type='text' className='form-control' id='name' onChange={(e) => setName(e.target.value)} value={name} required />
                                        </div>
                                        {/* Agrega los demás campos del formulario aquí */}
                                        <div className="mb-3">
                                            <label htmlFor="contacto" className="form-label">Contacto</label>
                                            <input className="form-control" id="contacto" onChange={(e) => setContacto(e.target.value)} value={contacto} placeholder="Contacto del Proveedor" required />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="direccion" className="form-label">Direccion</label>
                                            <input className="form-control" id="direccion" onChange={(e) => setDireccion(e.target.value)} value={direccion} placeholder="Direccion del Proveedor" required />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor=" telefono" className="form-label">Telefono</label>
                                            <input className="form-control" id=" telefono" onChange={(e) => setTelefono(e.target.value)} value={telefono} placeholder="Telefono del Proveedor" required />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="correo" className="form-label">Correo</label>
                                            <input className="form-control" id=" correo" onChange={(e) => setCorreo(e.target.value)} value={correo} placeholder="Correo del Proveedor" required />
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
                                    <th>PROVEEDORES</th>
                                    <th>CONTACTO</th>
                                    <th>DIRECCION</th>
                                    <th>TELEFONO</th>
                                    <th>CORREO</th>
                                    <th>ACCIONES</th>
                                </tr>
                            </thead>

                            {/* Cuerpo de la tabla */}
                            <tbody>
                                {/* Utiliza la función de filtrado si hay una categoría seleccionada, de lo contrario, muestra todos los Proveedors */}
                                {ProveedorFiltro ? filtrarPorProveedor().map((Proveedor, index) => (
                                    <tr key={Proveedor._id}>
                                        <td>{index + 1}</td>
                                        <td>{Proveedor.name}</td>
                                        <td>{Proveedor.contacto}</td>
                                        <td>{Proveedor.telefono}</td>
                                        <td>{Proveedor.direccion}</td>
                                        <td>{Proveedor.correo}</td>
                                        <td>
                                            <button onClick={() => openModal(2, Proveedor._id, Proveedor.name, Proveedor.contacto,Proveedor.telefono,Proveedor.direccion,Proveedor.correo)} className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#exampleModal' >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button className='btn btn-danger' onClick={() => eliminarProveedor(Proveedor._id, Proveedor.name)}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    </tr>
                                )) : Proveedor.map((Proveedor, index) => (
                                    <tr key={Proveedor._id}>
                                        <td>{index + 1}</td>
                                        <td>{Proveedor.name}</td>
                                        <td>{Proveedor.contacto}</td>
                                        <td>{Proveedor.telefono}</td>
                                        <td>{Proveedor.direccion}</td>
                                        <td>{Proveedor.correo}</td>
                                        <td>
                                            <button onClick={() => openModal(2, Proveedor._id, Proveedor.name, Proveedor.contacto,Proveedor.telefono,Proveedor.direccion,Proveedor.correo)} className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#exampleModal' >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button className='btn btn-danger' onClick={() => eliminarProveedor(Proveedor._id, Proveedor.name)}>
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




export default VerProveedor;