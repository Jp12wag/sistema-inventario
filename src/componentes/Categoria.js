import React, { useState, useEffect } from 'react';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle'; // Importar Bootstrap
import { verAlerta } from './funciones'
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';


const VerCategoria = () => {
    const token = localStorage.getItem('token');
    const userId=localStorage.getItem('id');
    const [id, setId] = useState('');
    const [categoria, setCategoria] = useState([]);
    const [name, setName] = useState();
    const [descripcion, setDescripcion] = useState();
    const [title, setTitle] = useState('');
    const [operacion, setOperacion] = useState(1);
    const [categoriaFiltro, setCategoriaFiltro] = useState('');
    

    useEffect(() => {
        getCategoria();
    }, []);

    const getCategoria = async () => {
        try {
            const respuesta = await obtenerCategorias(); // Esperar a que se resuelva la promesa
            setCategoria(respuesta);
        } catch (error) {
            console.error('Error al obtener las categorias:', error);
        }
    }

    async function obtenerCategorias() {
        try {
            const response = await fetch('http://localhost:3001/categorias', {
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

    let eliminarCategoria = (id, name) => {
        const Myswal = withReactContent(Swal);
        Myswal.fire({
            title: '¿Estás seguro que quieres eliminar ' + name + ' el categoria?',
            icon: 'question',
            text: 'No podrás revertir este paso',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                
                enviarSolicitud('DELETE', { id: id });
                getCategoria();
            } else {
                verAlerta('El categoria no fue eliminado', 'info');
            }
        });
    }


    const openModal = (op, id, name, descripcion) => {
        setId('');
        setName('');
        setDescripcion('');
       
        setOperacion(op);
        if (op === 1) {
            setTitle('Registrar Categoria');

        } else if (op === 2) {
            setTitle('Editar Categoria');
            setId(id);
            setName(name);
            setDescripcion(descripcion);
           
        }

        window.setTimeout(function () {
            document.getElementById('name').focus();
        }, 500);


    };

    const validar = () => {
        var parametros;
        var metodo;
        if (name.trim() === '') {
            verAlerta('Escribe el nombre de la categoria', 'warning');

        } else if (descripcion.trim() === '') {
            verAlerta('Escribe la descripcion dela categoria', 'warning');
        } else {
            if (operacion === 1) {
                parametros = { name: name, descripcion: descripcion, owner: userId };
                metodo = 'POST'

            } else {
                parametros = { id: id, name: name, descripcion: descripcion};
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

     // Función para filtrar los categorias por categoría
     const filtrarPorCategoria = () => {
        return categoria.filter(categoria => categoria.name.toLowerCase() === categoriaFiltro.toLowerCase());
    }

    // Manejar cambios en el input de búsqueda de categoría
    const handleChangeCategoria = (e) => {
        setCategoriaFiltro(e.target.value);
    }



    const enviarSolicitud = async (metodo, parametros) => {
        try {

            let url = 'http://localhost:3001/categorias';
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
                throw new Error('Error al agregar la categoria');
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
           getCategoria();

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
                                            <label htmlFor='name' className='form-label'>Nombre de la categoria</label>
                                            <input type='text' className='form-control' id='name' onChange={(e) => setName(e.target.value)} value={name} required />
                                        </div>
                                        {/* Agrega los demás campos del formulario aquí */}
                                        <div className="mb-3">
                                            <label htmlFor="descripcion" className="form-label">Descripción</label>
                                            <textarea className="form-control" id="descripcion" onChange={(e) => setDescripcion(e.target.value)} value={descripcion} placeholder="Descripción del categoria" required ></textarea>
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
                                    <th>CATEGORIA</th>
                                    <th>DESCRIPCION</th>
                                    <th>ACCIONES</th>
                                </tr>
                            </thead>

                                {/* Cuerpo de la tabla */}
                                <tbody>
                                    {/* Utiliza la función de filtrado si hay una categoría seleccionada, de lo contrario, muestra todos los categorias */}
                                    {categoriaFiltro ? filtrarPorCategoria().map((categoria, index) => (
                                        <tr key={categoria._id}>
                                            <td>{index + 1}</td>
                                            <td>{categoria.name}</td>
                                            <td>{categoria.descripcion}</td>
    
                                            <td>
                                                <button onClick={() => openModal(2, categoria._id, categoria.name, categoria.descripcion)} className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#exampleModal' >
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </button>
                                                <button className='btn btn-danger' onClick={() => eliminarCategoria(categoria._id, categoria.name)}>
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : categoria.map((categoria, index) => (
                                        <tr key={categoria._id}>
                                            <td>{index + 1}</td>
                                            <td>{categoria.name}</td>
                                            <td>{categoria.descripcion}</td>
                                            <td>
                                                <button onClick={() => openModal(2, categoria._id, categoria.name, categoria.descripcion)} className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#exampleModal' >
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </button>
                                                <button className='btn btn-danger' onClick={() => eliminarCategoria(categoria._id, categoria.name)}>
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




export default VerCategoria;