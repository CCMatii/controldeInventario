import React from "react";
import { listarProveedores, eliminarProveedor, modificarProveedor, agregarProveedor } from "../services/consultas";
import "./List_provee.css";

function ListProvee({ visible, actualizaVisibilidad }) {
  const [proveedores, setProveedores] = React.useState([]);
  const [error, setError] = React.useState("");
  const [modalAbierto, setModalAbierto] = React.useState(false);
  const [proveedorEdit, setProveedorEdit] = React.useState(null);

  // Estados para editar
  const [nuevoNombre, setNuevoNombre] = React.useState("");
  const [nuevoVendedor, setNuevoVendedor] = React.useState("");
  const [nuevoContacto, setNuevoContacto] = React.useState("");
  const [nuevaDireccion, setNuevaDireccion] = React.useState("");
  const [nuevaComuna, setNuevaComuna] = React.useState("");
  const [nuevoGiro, setNuevoGiro] = React.useState("");

  // Estados para agregar
  const [modalAgregar, setModalAgregar] = React.useState(false);
  const [nuevoIdAgregar, setNuevoIdAgregar] = React.useState("");
  const [nuevoNombreAgregar, setNuevoNombreAgregar] = React.useState("");
  const [nuevoVendedorAgregar, setNuevoVendedorAgregar] = React.useState("");
  const [nuevoContactoAgregar, setNuevoContactoAgregar] = React.useState("");
  const [nuevaDireccionAgregar, setNuevaDireccionAgregar] = React.useState("");
  const [nuevaComunaAgregar, setNuevaComunaAgregar] = React.useState("");
  const [nuevoGiroAgregar, setNuevoGiroAgregar] = React.useState("");

  const handleListarProveedores = async () => {
    try {
      const resultado = await listarProveedores();
      setProveedores(resultado);
    } catch (error) {
      setError("No se pudo listar los proveedores. Inténtalo de nuevo.");
    }
  };

  const handleEliminarProveedor = async (proveedorId) => {
    try {
      await eliminarProveedor(proveedorId);
      setProveedores(proveedores.filter((proveedor) => proveedor.proveedor_id !== proveedorId));
    } catch (error) {
      setError("No se pudo eliminar el proveedor. Inténtalo de nuevo.");
    }
  };

  const abrirModal = (proveedor) => {
    setProveedorEdit(proveedor);
    setNuevoNombre(proveedor.proveedor_nombre);
    setNuevoVendedor(proveedor.proveedor_vendedor);
    setNuevoContacto(proveedor.proveedor_contacto);
    setNuevaDireccion(proveedor.proveedor_direccion);
    setNuevaComuna(proveedor.proveedor_comuna);
    setNuevoGiro(proveedor.proveedor_giro);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setProveedorEdit(null);
    setNuevoNombre("");
    setNuevoVendedor("");
    setNuevoContacto("");
    setNuevaDireccion("");
    setNuevaComuna("");
    setNuevoGiro("");
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      await modificarProveedor({
        id: proveedorEdit.proveedor_id,
        nombre: nuevoNombre,
        vendedor: nuevoVendedor,
        contacto: nuevoContacto,
        direccion: nuevaDireccion,
        comuna: nuevaComuna,
        giro: nuevoGiro,
      });
      setProveedores(
        proveedores.map((p) =>
          p.proveedor_id === proveedorEdit.proveedor_id
            ? {
                ...p,
                proveedor_nombre: nuevoNombre,
                proveedor_vendedor: nuevoVendedor,
                proveedor_contacto: nuevoContacto,
                proveedor_direccion: nuevaDireccion,
                proveedor_comuna: nuevaComuna,
                proveedor_giro: nuevoGiro,
              }
            : p
        )
      );
      cerrarModal();
    } catch (error) {
      setError("No se pudo modificar el proveedor. Inténtalo de nuevo.");
    }
  };

  const abrirModalAgregar = () => {
    setNuevoIdAgregar("");
    setNuevoNombreAgregar("");
    setNuevoVendedorAgregar("");
    setNuevoContactoAgregar("");
    setNuevaDireccionAgregar("");
    setNuevaComunaAgregar("");
    setNuevoGiroAgregar("");
    setModalAgregar(true);
  };

  const cerrarModalAgregar = () => {
    setModalAgregar(false);
    setNuevoIdAgregar("");
    setNuevoNombreAgregar("");
    setNuevoVendedorAgregar("");
    setNuevoContactoAgregar("");
    setNuevaDireccionAgregar("");
    setNuevaComunaAgregar("");
    setNuevoGiroAgregar("");
  };

  const handleAgregarProveedor = async (e) => {
    e.preventDefault();
    try {
      const nuevoProveedor = await agregarProveedor({
        id: nuevoIdAgregar,
        nombre: nuevoNombreAgregar,
        vendedor: nuevoVendedorAgregar,
        contacto: nuevoContactoAgregar,
        direccion: nuevaDireccionAgregar,
        comuna: nuevaComunaAgregar,
        giro: nuevoGiroAgregar,
      });
      setProveedores([...proveedores, nuevoProveedor]);
      cerrarModalAgregar();
    } catch (error) {
      setError("No se pudo agregar el proveedor. Inténtalo de nuevo.");
    }
  };

  React.useEffect(() => {
    if (visible) {
      handleListarProveedores();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="listar-modal-fondo">
      <div className="listar-modal-contenido">
        <button className="listar-modal-cerrar" onClick={() => actualizaVisibilidad(false)}>✖️</button>
        <h2 className="title-listaproveedor">Lista de Proveedores</h2>
        <button className="agregarbutton" onClick={abrirModalAgregar}>Agregar Proveedor</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <table className="tabla-proveedores">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Vendedor</th>
              <th>Contacto</th>
              <th>Dirección</th>
              <th>Comuna</th>
              <th>Giro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map((proveedor) => (
              <tr key={proveedor.proveedor_id}>
                <td>{proveedor.proveedor_id}</td>
                <td>{proveedor.proveedor_nombre}</td>
                <td>{proveedor.proveedor_vendedor}</td>
                <td>{proveedor.proveedor_contacto}</td>
                <td>{proveedor.proveedor_direccion}</td>
                <td>{proveedor.proveedor_comuna}</td>
                <td>{proveedor.proveedor_giro}</td>
                <td>
                  <button
                    className="botonEditar"
                    onClick={() => abrirModal(proveedor)}
                    title="Modificar"
                  >
                    ✏️
                  </button>
                  <button
                    className="botonEliminar"
                    onClick={() => handleEliminarProveedor(proveedor.proveedor_id)}
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
              <h3>Agregar Proveedor</h3>
              <form onSubmit={handleAgregarProveedor}>
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
                  Vendedor:
                  <input
                    type="text"
                    value={nuevoVendedorAgregar}
                    onChange={(e) => setNuevoVendedorAgregar(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Contacto:
                  <input
                    type="text"
                    value={nuevoContactoAgregar}
                    onChange={(e) => setNuevoContactoAgregar(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Dirección:
                  <input
                    type="text"
                    value={nuevaDireccionAgregar}
                    onChange={(e) => setNuevaDireccionAgregar(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Comuna:
                  <input
                    type="text"
                    value={nuevaComunaAgregar}
                    onChange={(e) => setNuevaComunaAgregar(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Giro:
                  <input
                    type="text"
                    value={nuevoGiroAgregar}
                    onChange={(e) => setNuevoGiroAgregar(e.target.value)}
                    required
                  />
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
              <h3>Modificar Proveedor</h3>
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
                  Vendedor:
                  <input
                    type="text"
                    value={nuevoVendedor}
                    onChange={(e) => setNuevoVendedor(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Contacto:
                  <input
                    type="text"
                    value={nuevoContacto}
                    onChange={(e) => setNuevoContacto(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Dirección:
                  <input
                    type="text"
                    value={nuevaDireccion}
                    onChange={(e) => setNuevaDireccion(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Comuna:
                  <input
                    type="text"
                    value={nuevaComuna}
                    onChange={(e) => setNuevaComuna(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Giro:
                  <input
                    type="text"
                    value={nuevoGiro}
                    onChange={(e) => setNuevoGiro(e.target.value)}
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
    </div>
  );
}

export default ListProvee;