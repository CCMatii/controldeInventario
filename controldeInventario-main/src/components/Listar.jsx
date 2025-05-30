import React from "react";
import { listarUsuarios, eliminarUsuario, modificarUsuario, agregarUsuario, listarCargos } from "../services/consultas";
import CryptoJS from "crypto-js";
import "./Listar.css";

function Listar({ visible, actualizaVisibilidad }) {
  const [usuarios, setUsuarios] = React.useState([]);
  const [cargos, setCargos] = React.useState([]);
  const [error, setError] = React.useState("");
  const [modalAbierto, setModalAbierto] = React.useState(false);
  const [usuarioEdit, setUsuarioEdit] = React.useState(null);
  const [nuevoNombre, setNuevoNombre] = React.useState("");
  const [nuevaContrasena, setNuevaContrasena] = React.useState("");
  const [nuevoCargo, setNuevoCargo] = React.useState("");
  const [modalAgregar, setModalAgregar] = React.useState(false);
  const [nuevoNombreAgregar, setNuevoNombreAgregar] = React.useState("");
  const [nuevaContrasenaAgregar, setNuevaContrasenaAgregar] = React.useState("");
  const [nuevoCargoAgregar, setNuevoCargoAgregar] = React.useState("");
  const [nuevoIdAgregar, setNuevoIdAgregar] = React.useState(""); // Nuevo estado para el ID

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

  const abrirModalAgregar = () => {
    setNuevoIdAgregar("");
    setNuevoNombreAgregar("");
    setNuevaContrasenaAgregar("");
    setNuevoCargoAgregar("");
    setModalAgregar(true);
  };

  const cerrarModalAgregar = () => {
    setModalAgregar(false);
    setNuevoIdAgregar("");
    setNuevoNombreAgregar("");
    setNuevaContrasenaAgregar("");
    setNuevoCargoAgregar("");
  };

  const handleAgregarUsuario = async (e) => {
    e.preventDefault();
    try {
      const contrasenaHasheada = CryptoJS.SHA256(nuevaContrasenaAgregar).toString();
      const nuevoUsuario = await agregarUsuario({
        id: nuevoIdAgregar,
        nombre: nuevoNombreAgregar,
        contrasena: contrasenaHasheada,
        cargo_nombre: nuevoCargoAgregar,
      });
      setUsuarios([...usuarios, nuevoUsuario]);
      cerrarModalAgregar();
    } catch (error) {
      setError("No se pudo agregar el usuario. Inténtalo de nuevo.");
    }
  };

  const handleListarCargos = async () => {
    try {
      const resultado = await listarCargos(); // Asegúrate de tener esta función en tu archivo de servicios
      setCargos(resultado);
    } catch (error) {
      console.error("No se pudieron listar los cargos:", error);
    }
  };

  React.useEffect(() => {
    if (visible) {
      handleListarUsuarios();
      handleListarCargos();
    }
  }, [visible]);

  React.useEffect(() => {
    if (modalAgregar || modalAbierto) {
      handleListarCargos();
    }
  }, [modalAgregar, modalAbierto]);

  if (!visible) return null;

  return (
    <div className="listar-modal-fondo">
      <div className="listar-modal-contenido">
        <button className="listar-modal-cerrar" onClick={() => actualizaVisibilidad(false)}>✖️</button>
        <h2 className="title-listausuario">Lista de Usuarios</h2>
        <button className="agregarbutton" onClick={abrirModalAgregar}>Agregar Usuario</button>
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
        {modalAgregar && (
          <div className="listar-modal-agregar-fondo">
            <div className="listar-modal-agregar-contenido">
              <h3>Agregar Usuario</h3>
              <form onSubmit={handleAgregarUsuario}>
                <label>
                  ID:
                  <input
                    type="text"
                    value={nuevoIdAgregar}
                    onChange={(e) => setNuevoIdAgregar(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Nombre:
                  <input
                    type="text"
                    value={nuevoNombreAgregar}
                    onChange={(e) => setNuevoNombreAgregar(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Contraseña:
                  <input
                    type="password"
                    value={nuevaContrasenaAgregar}
                    onChange={(e) => setNuevaContrasenaAgregar(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Cargo:
                  <select
                    value={nuevoCargoAgregar}
                    onChange={(e) => setNuevoCargoAgregar(e.target.value)}
                    required
                  >
                    <option value="">Seleccione un cargo</option>
                    {cargos.map((cargo) => (
                      <option key={cargo.cargo_nombre} value={cargo.cargo_nombre}>
                        {cargo.cargo_nombre}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="listar-modal-agregar-acciones">
                  <button type="submit" className="listar-modal-agregar-btn-guardar">Agregar</button>
                  <button type="button" className="listar-modal-agregar-btn-cancelar" onClick={cerrarModalAgregar}>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
                  <select
                    value={nuevoCargo}
                    onChange={(e) => setNuevoCargo(e.target.value)}
                    required
                  >
                    <option value="">Seleccione un cargo</option>
                    {cargos.map((cargo) => (
                      <option key={cargo.cargo_nombre} value={cargo.cargo_nombre}>
                        {cargo.cargo_nombre}
                      </option>
                    ))}
                  </select>
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
    </div>
  );
}

export default Listar;