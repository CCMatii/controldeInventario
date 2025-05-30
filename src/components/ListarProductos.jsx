import React from "react";
import { listarProductos, eliminarProducto, modificarProducto, agregarProducto } from "../services/consultas";
import "./ListarProductos.css";

function ListarProductos({ visible, actualizaVisibilidad }) {
  const [productos, setProductos] = React.useState([]);
  const [error, setError] = React.useState("");
  const [modalAbierto, setModalAbierto] = React.useState(false);
  const [productoEdit, setProductoEdit] = React.useState(null);
  const [nuevoNombre, setNuevoNombre] = React.useState("");
  const [nuevaDescripcion, setNuevaDescripcion] = React.useState("");
  const [nuevoProovedor, setNuevoProovedor] = React.useState("");
  const [modalAgregar, setModalAgregar] = React.useState(false);
  const [nuevoIdAgregar, setNuevoIdAgregar] = React.useState("");
  const [nuevoNombreAgregar, setNuevoNombreAgregar] = React.useState("");
  const [nuevaDescripcionAgregar, setNuevaDescripcionAgregar] = React.useState("");
  const [nuevoProovedorAgregar, setNuevoProovedorAgregar] = React.useState("");

  const handleListarProductos = async () => {
    try {
      const resultado = await listarProductos();
      setProductos(resultado);
    } catch (error) {
      setError("No se pudo listar los productos. Inténtalo de nuevo.");
    }
  };

  const handleEliminarProducto = async (productoId) => {
    try {
      await eliminarProducto(productoId);
      setProductos(productos.filter((producto) => producto.producto_id !== productoId));
    } catch (error) {
      setError("No se pudo eliminar el producto. Inténtalo de nuevo.");
    }
  };

  const abrirModal = (producto) => {
    setProductoEdit(producto);
    setNuevoNombre(producto.producto_nombre);
    setNuevaDescripcion(producto.producto_descripcion);
    setNuevoProovedor(producto.producto_proovedor);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setProductoEdit(null);
    setNuevoNombre("");
    setNuevaDescripcion("");
    setNuevoProovedor("");
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      await modificarProducto({
        id: productoEdit.producto_id,
        nombre: nuevoNombre,
        descripcion: nuevaDescripcion,
        proovedor: nuevoProovedor,
      });
      setProductos(
        productos.map((p) =>
          p.producto_id === productoEdit.producto_id
            ? { ...p, producto_nombre: nuevoNombre, producto_descripcion: nuevaDescripcion, producto_proovedor: nuevoProovedor }
            : p
        )
      );
      cerrarModal();
    } catch (error) {
      setError("No se pudo modificar el producto. Inténtalo de nuevo.");
    }
  };

  const abrirModalAgregar = () => {
    setNuevoIdAgregar("");
    setNuevoNombreAgregar("");
    setNuevaDescripcionAgregar("");
    setNuevoProovedorAgregar("");
    setModalAgregar(true);
  };

  const cerrarModalAgregar = () => {
    setModalAgregar(false);
    setNuevoIdAgregar("");
    setNuevoNombreAgregar("");
    setNuevaDescripcionAgregar("");
    setNuevoProovedorAgregar("");
  };

  const handleAgregarProducto = async (e) => {
    e.preventDefault();
    try {
      if (parseInt(nuevoIdAgregar, 10) < 0) {
        setError("El ID no puede ser un número negativo.");
        return;
      }

      const nuevoProducto = await agregarProducto({
        producto_id: parseInt(nuevoIdAgregar, 10),
        producto_nombre: nuevoNombreAgregar,
        producto_descripcion: nuevaDescripcionAgregar,
        producto_proovedor: parseInt(nuevoProovedorAgregar, 10),
      });
      setProductos([...productos, nuevoProducto]);
      cerrarModalAgregar();
    } catch (error) {
      setError("No se pudo agregar el producto. Inténtalo de nuevo.");
      console.error(error);
    }
  };

  React.useEffect(() => {
    if (visible) {
      handleListarProductos();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="listar-modal-fondo">
      <div className="listar-modal-contenido">
        <button className="listar-modal-cerrar" onClick={() => actualizaVisibilidad(false)}>✖️</button>
        <h2 className="title-listaproductos">Lista de Productos</h2>
        <button className="agregarbutton" onClick={abrirModalAgregar}>Agregar Producto</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <table className="tabla-productos">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Proovedor</th> 
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.producto_id}>
                <td>{producto.producto_id}</td>
                <td>{producto.producto_nombre}</td>
                <td>{producto.producto_descripcion}</td>
                <td>{producto.producto_proovedor}</td>
                <td>
                  <button
                    className="botonEditar"
                    onClick={() => abrirModal(producto)}
                    title="Modificar"
                  >
                    ✏️
                  </button>
                  <button
                    className="botonEliminar"
                    onClick={() => handleEliminarProducto(producto.producto_id)}
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
              <h3>Agregar Producto</h3>
              <form onSubmit={handleAgregarProducto}>
                <label>
                  ID:
                  <input
                    type="number"
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
                  Descripción:
                  <input
                    type="text"
                    value={nuevaDescripcionAgregar}
                    onChange={(e) => setNuevaDescripcionAgregar(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Proveedor:
                  <input
                    type="number"
                    value={nuevoProovedorAgregar}
                    onChange={(e) => setNuevoProovedorAgregar(e.target.value)}
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
              <h3>Modificar Producto</h3>
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
                  Descripción:
                  <input
                    type="text"
                    value={nuevaDescripcion}
                    onChange={(e) => setNuevaDescripcion(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Proovedor:
                  <input
                    type="text"
                    value={nuevoProovedor}
                    onChange={(e) => setNuevoProovedor(e.target.value)}
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

export default ListarProductos;