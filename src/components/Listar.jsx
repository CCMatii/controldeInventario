import React from "react";
import { listarUsuarios, eliminarUsuario, modificarUsuario, agregarUsuario, listarCargos } from "../services/consultas";
import CryptoJS from "crypto-js";
import ListarCargos from "./ListarCargos";
import "./Listar.css";

function Listar({ visible, actualizaVisibilidad }) {
  const [usuarios, setUsuarios] = React.useState([]);
  const [cargos, setCargos] = React.useState([]);
  const [errorGeneral, setErrorGeneral] = React.useState("");
  const [errorAgregar, setErrorAgregar] = React.useState("");
  const [errorEditar, setErrorEditar] = React.useState("");
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
  const [modalCargos, setModalCargos] = React.useState(false); // <-- Nuevo estado

  const handleListarUsuarios = async () => {
    try {
      const resultado = await listarUsuarios();
      setUsuarios(resultado);
    } catch (error) {
      setErrorGeneral("No se pudo listar los usuarios. Inténtalo de nuevo.");
    }
  };

  const handleEliminarUsuario = async (usuarioId) => {
    if (!window.confirm("¿Seguro que deseas eliminar este cargo?")) return;
    try {
      await eliminarUsuario(usuarioId);
      setUsuarios(usuarios.filter((usuario) => usuario.usuario_id !== usuarioId));
    } catch (error) {
      setErrorGeneral("No se pudo eliminar el usuario. Inténtalo de nuevo.");
    }
  };

  const abrirModal = (usuario) => {
    setUsuarioEdit(usuario);
    setNuevoNombre(usuario.usuario_nombre);
    setNuevaContrasena("");
    setNuevoCargo(usuario.cargo_nombre);
    setModalAbierto(true);
    setErrorGeneral("");
    setErrorEditar("");
    setErrorAgregar("");
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

    if(nuevoNombre.trim() === "") {
      setErrorEditar("El nombre no puede estar vacío.");
      return;
    }
    if(nuevoCargo.trim() === "") {
      setErrorEditar("El cargo no puede estar vacío.");
      return;
    }
    
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
      setErrorEditar("No se pudo modificar el usuario. Inténtalo de nuevo.");
    }
  };

  const abrirModalAgregar = () => {
    setNuevoIdAgregar("");
    setNuevoNombreAgregar("");
    setNuevaContrasenaAgregar("");
    setNuevoCargoAgregar("");
    setModalAgregar(true);
    setErrorAgregar("");
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
      if (parseInt(nuevoIdAgregar, 10) < 0) {
        setError("El ID no puede ser un número negativo.");
        return;
      }
      if (nuevoNombreAgregar.trim() === "") {
        setError("El nombre no puede estar vacío.");
        return;
      }
      if (nuevaContrasenaAgregar.trim() === "") {
        setError("La contraseña no puede estar vacía.");
        return;
      }
      if (nuevoCargoAgregar.trim() === "") {
        setError("El cargo no puede estar vacío.");
        return;
      }

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
      setErrorAgregar("No se pudo agregar el usuario. Inténtalo de nuevo.");
    }
  };

  const handleListarCargos = async () => {
    try {
      const resultado = await listarCargos();
      setCargos(resultado);
    } catch (error) {
      setErrorGeneral("No se pudieron cargar los cargos. Inténtalo de nuevo.");
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
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button className="agregarbutton" onClick={abrirModalAgregar}>Agregar Usuario</button>
          <button className="agregarbutton" onClick={() => setModalCargos(true)}>Ver Cargos</button>
        </div>
        {errorGeneral && <p style={{ color: "red" }}>{errorGeneral}</p>}
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
                    className="botonEditarListar"
                    onClick={() => abrirModal(usuario)}
                    title="Modificar"
                  >
                    ✏️
                  </button>
                  <button
                    className="botonEliminarListar"
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
              {errorAgregar && <p style={{ color: "red" }}>{errorAgregar}</p>}
              <form onSubmit={handleAgregarUsuario}>
                <label>
                  ID:
                  <input
                    type="number"
                    value={nuevoIdAgregar}
                    onChange={(e) => setNuevoIdAgregar(e.target.value)}
                    
                  />
                </label>
                <label>
                  Nombre:
                  <input
                    type="text"
                    value={nuevoNombreAgregar}
                    onChange={(e) => setNuevoNombreAgregar(e.target.value)}
                    
                  />
                </label>
                <label>
                  Contraseña:
                  <input
                    type="password"
                    value={nuevaContrasenaAgregar}
                    onChange={(e) => setNuevaContrasenaAgregar(e.target.value)}
                    
                  />
                </label>
                <label>
                  Cargo:
                  <select
                    value={nuevoCargoAgregar}
                    onChange={(e) => setNuevoCargoAgregar(e.target.value)}
                    
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
              {errorEditar && <p style={{ color: "red" }}>{errorEditar}</p>}
              <form onSubmit={handleGuardar}>
                <label>
                  Nombre:
                  <input
                    type="text"
                    value={nuevoNombre}
                    onChange={(e) => setNuevoNombre(e.target.value)}
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
                  <button type="submit" className="listar-modal-agregar-btn-guardar">Guardar</button>
                  <button type="button" className="listar-modal-agregar-btn-cancelar"onClick={cerrarModal}>Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}
        <ListarCargos visible={modalCargos} onClose={() => setModalCargos(false)} />
      </div>
    </div>
  );
}

export default Listar;