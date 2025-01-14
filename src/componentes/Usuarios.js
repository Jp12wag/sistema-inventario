import React, { useState, useEffect } from 'react';
import '../stylesheet/usuarios.css'

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [formData, setFormData] = useState({ name: '', email: '', roles: '', password: '' });
    const [editingUserId, setEditingUserId] = useState(null);
    const [error, setError] = useState(null);
    const token= localStorage.getItem('token')

    useEffect(() => {
        cargarUsuarios();
    }, []);

    async function cargarUsuarios() {
        try {
            const response = await fetch('http://localhost:3001/users',{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
    
            if (Array.isArray(data)) {
                setUsuarios(data);
            } else {
                setUsuarios([]); // o manejar de otra forma si no es un array
                console.error('La respuesta no es un array:', data);
            }
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            setError('No se pudo cargar la lista de usuarios.');
        }
    }

    async function agregarUsuario(e) {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) throw new Error('Error al agregar usuario');
            await cargarUsuarios();
            setFormData({ name: '', email: '', roles: '', password: '' });
        } catch (error) {
            console.error('Error:', error);
            setError('No se pudo agregar el usuario.');
        }
    }

    async function eliminarUsuario(id) {
        try {
            await fetch(`http://localhost:3001/users/${id}`, {
                method: 'DELETE'
            });
            cargarUsuarios();
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            setError('No se pudo eliminar el usuario.');
        }
    }

    async function editarUsuario(e) {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3001/users/${editingUserId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) throw new Error('Error al actualizar usuario');
            setEditingUserId(null);
            setFormData({ name: '', email: '', roles: '', password: '' });
            cargarUsuarios();
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            setError('No se pudo actualizar el usuario.');
        }
    }

    return (
        <div className="usuariosRegistrado">
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={editingUserId ? editarUsuario : agregarUsuario}>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Roles"
                    value={formData.roles}
                    onChange={(e) => setFormData({ ...formData, roles: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                />
                <button type="submit">{editingUserId ? 'Actualizar' : 'Agregar'}</button>
                {editingUserId && <button onClick={() => setEditingUserId(null)}>Cancelar</button>}
            </form>

            <ul className='listaUsuarios'>
                {usuarios.map((usuario) => (
                    <li key={usuario._id}>
                        {usuario.name} - {usuario.email}
                        <button onClick={() => {
                            setEditingUserId(usuario._id);
                            setFormData({
                                name: usuario.name,
                                email: usuario.email,
                                roles: usuario.roles,
                                password: '' // No se muestra la contraseña
                            });
                        }}>Editar</button>
                        <button onClick={() => eliminarUsuario(usuario._id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Usuarios;
