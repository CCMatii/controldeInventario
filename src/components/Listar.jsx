import React from "react";
import { listarUsuarios, eliminarUsuario, modificarUsuario } from "../services/consultas";
import CryptoJS from "crypto-js";
import "./Listar.css";

function Listar({ visible, actualizaVisibilidad }) {
  const [usuarios, setUsuarios] = React.useState([]);
  const [error, setError] = React.useState("");
  const [modalAbierto, setModalAbierto] = React.useState(false);
  const [usuarioEdit, setUsuarioEdit] = React.useState(null);
  const [nuevoNombre, setNuevoNombre] = React.useState("");
  const [nuevaContrasena, setNuevaContrasena] = React.useState("");
  const [nuevoCargo, setNuevoCargo] = React.useState("");

  const handleListarUsuarios = async () => {
    try {
      const resultado = await listarUsuarios();
      setUsuarios(resultado);
    } catch (error) {
      setError("No se pudo listar los usuarios. Inténtalo de nuevo.");
    }
  };

  const handleEliminarUsuario = async (usuarioId) => {
    try {
      await eliminarUsuario(usuarioId);
      setUsuarios(usuarios.filter((usuario) => usuario.usuario_id !== usuarioId));
    } catch (error) {
      setError("No se pudo eliminar el usuario. Inténtalo de nuevo.");
    }
  };

  const abrirModal = (usuario) => {
    setUsuarioEdit(usuario);
    setNuevoNombre(usuario.usuario_nombre);
    setNuevaContrasena("");
    setNuevoCargo(usuario.cargo_nombre);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setUsuarioEdit(null);
    setNuevoNombre("");
    setNuevaContrasena("");
    setNuevoCargo("");
  };

  const handleGuardar = async (e) => {
  e.preventDefault();
  try {
    let contrasenaHasheada = nuevaContrasena;
    if (nuevaContrasena) {
      contrasenaHasheada = CryptoJS.SHA256(nuevaContrasena).toString();
    }
    await modificarUsuario({
      id: usuarioEdit.usuario_id,
      nombre: nuevoNombre,
      contrasena: contrasenaHasheada,
      cargo_nombre: nuevoCargo,
    });
    setUsuarios(
      usuarios.map((u) =>
        u.usuario_id === usuarioEdit.usuario_id
          ? { ...u, usuario_nombre: nuevoNombre, cargo_nombre: nuevoCargo }
          : u
      )
    );
    cerrarModal();
  } catch (error) {
    setError("No se pudo modificar el usuario. Inténtalo de nuevo.");
  }
};

  React.useEffect(() => {
    if (visible) {
      handleListarUsuarios();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="listar">
      <h2>Lista de Usuarios</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table className="tabla-usuarios">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Cargo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.usuario_id}>
              <td>{usuario.usuario_id}</td>
              <td>{usuario.usuario_nombre}</td>
              <td>{usuario.cargo_nombre}</td>
              <td>
                <button
                  className="botonEditar"
                  onClick={() => abrirModal(usuario)}
                  title="Modificar"
                >
                  ✏️
                </button>
                <button
                  className="botonEliminar"
                  onClick={() => handleEliminarUsuario(usuario.usuario_id)}
                  title="Eliminar"
                >
                  ✖️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalAbierto && (
        <div className="modal-fondo">
          <div className="modal-contenido">
            <h3>Modificar Usuario</h3>
            <form onSubmit={handleGuardar}>
              <label>
                Nombre:
                <input
                  type="text"
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  required
                />
              </label>
              <label>
                Contraseña:
                <input
                  type="password"
                  value={nuevaContrasena}
                  onChange={(e) => setNuevaContrasena(e.target.value)}
                  placeholder="Nueva contraseña"
                />
              </label>
              <label>
                Cargo:
                <input
                  type="text"
                  value={nuevoCargo}
                  onChange={(e) => setNuevoCargo(e.target.value)}
                  required
                />
              </label>
              <div className="modal-acciones">
                <button type="submit">Guardar</button>
                <button type="button" onClick={cerrarModal}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Listar;