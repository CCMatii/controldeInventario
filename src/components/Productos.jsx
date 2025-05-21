import React, { useEffect, useState } from "react";
import { listarProductos, eliminarProducto, modificarProducto, agregarProducto } from "../services/consultas";
import "./Productos.css";

function Productos({ visible }) {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalAgregar, setModalAgregar] = useState(false); // Nuevo estado para agregar
  const [productoEdit, setProductoEdit] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");
  const [nuevaBodega, setNuevaBodega] = useState("");
  const [nuevoProveedor, setNuevoProveedor] = useState("");
  // Estados para agregar
  const [agregarNombre, setAgregarNombre] = useState("");
  const [agregarDescripcion, setAgregarDescripcion] = useState("");
  const [agregarBodega, setAgregarBodega] = useState("");
  const [agregarProveedor, setAgregarProveedor] = useState("");
  const [agregarId, setAgregarId] = useState(""); // Nuevo estado para el ID

  useEffect(() => {
    if (visible) {
      const fetchProductos = async () => {
        try {
          const resultado = await listarProductos();
          setProductos(resultado);
        } catch (err) {
          setError("No se pudo listar los productos. Inténtalo de nuevo.");
        }
      };
      fetchProductos();
    }
  }, [visible]);

  const abrirModal = (producto) => {
    setProductoEdit(producto);
    setNuevoNombre(producto.producto_nombre);
    setNuevaDescripcion(producto.producto_descripcion);
    setNuevaBodega(producto.producto_bodega);
    setNuevoProveedor(producto.producto_proovedor);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setProductoEdit(null);
    setNuevoNombre("");
    setNuevaDescripcion("");
    setNuevaBodega("");
    setNuevoProveedor("");
  };

  const abrirModalAgregar = () => {
    setAgregarId(""); // Limpiar el ID al abrir el modal
    setAgregarNombre("");
    setAgregarDescripcion("");
    setAgregarBodega("");
    setAgregarProveedor("");
    setModalAgregar(true);
  };

  const cerrarModalAgregar = () => {
    setModalAgregar(false);
    setAgregarId("");
    setAgregarNombre("");
    setAgregarDescripcion("");
    setAgregarBodega("");
    setAgregarProveedor("");
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      await modificarProducto({
        id: productoEdit.producto_id,
        nombre: nuevoNombre,
        descripcion: nuevaDescripcion,
        bodega: nuevaBodega,
        proovedor: nuevoProveedor,
      });
      setProductos(
        productos.map((p) =>
          p.producto_id === productoEdit.producto_id
            ? {
                ...p,
                producto_nombre: nuevoNombre,
                producto_descripcion: nuevaDescripcion,
                producto_bodega: nuevaBodega,
                producto_proovedor: nuevoProveedor,
              }
            : p
        )
      );
      cerrarModal();
    } catch (err) {
      setError("No se pudo modificar el producto. Inténtalo de nuevo.");
    }
  };

  const handleEliminarProducto = async (productoId) => {
    try {
      await eliminarProducto(productoId);
      setProductos(productos.filter((p) => p.producto_id !== productoId));
    } catch (err) {
      setError("No se pudo eliminar el producto. Inténtalo de nuevo.");
    }
  };

  const handleAgregarProducto = async (e) => {
    e.preventDefault();
    try {
      const nuevoProducto = {
        producto_id: agregarId,
        producto_nombre: agregarNombre,
        producto_descripcion: agregarDescripcion,
        producto_bodega: agregarBodega,
        producto_proovedor: Number(agregarProveedor),
      };
      const productoAgregado = await agregarProducto(nuevoProducto);
      setProductos([...productos, productoAgregado]);
      cerrarModalAgregar();
    } catch (err) {
      setError("No se pudo agregar el producto. Inténtalo de nuevo.");
    }
  };

  if (!visible) return null;

  return (
    <div className="productos">
      <h2 className="productos-title">Lista de Productos</h2>
      <button onClick={abrirModalAgregar} style={{ marginBottom: "10px" }}>
        Agregar Producto
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table className="tabla-productos">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Bodega</th>
            <th>Proveedor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.producto_id}>
              <td>{producto.producto_id}</td>
              <td>{producto.producto_nombre}</td>
              <td>{producto.producto_descripcion}</td>
              <td>{producto.producto_bodega}</td>
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

      {/* Modal Modificar */}
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
                Bodega:
                <input
                  type="text"
                  value={nuevaBodega}
                  disabled
                />
              </label>
              <label>
                Proveedor:
                <input
                  type="text"
                  value={nuevoProveedor}
                  disabled
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

      {/* Modal Agregar */}
      {modalAgregar && (
        <div className="productos-modal-fondo">
          <div className="productos-modal-contenido">
            <h3>Agregar Producto</h3>
            <form onSubmit={handleAgregarProducto}>
              <label>
                ID:
                <input
                  type="text"
                  value={agregarId}
                  onChange={(e) => setAgregarId(e.target.value)}
                  required
                />
              </label>
              <label>
                Nombre:
                <input
                  type="text"
                  value={agregarNombre}
                  onChange={(e) => setAgregarNombre(e.target.value)}
                  required
                />
              </label>
              <label>
                Descripción:
                <input
                  type="text"
                  value={agregarDescripcion}
                  onChange={(e) => setAgregarDescripcion(e.target.value)}
                  required
                />
              </label>
              <label>
                Bodega:
                <input
                  type="text"
                  value={agregarBodega}
                  onChange={(e) => setAgregarBodega(e.target.value)}
                  required
                />
              </label>
              <label>
                Proveedor:
                <input
                  type="text"
                  value={agregarProveedor}
                  onChange={(e) => setAgregarProveedor(e.target.value)}
                  required
                />
              </label>
              <div className="productos-modal-acciones">
                <button type="submit" className="productos-btn-guardar">Agregar</button>
                <button type="button" className="productos-btn-cancelar" onClick={cerrarModalAgregar}>
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

export default Productos;