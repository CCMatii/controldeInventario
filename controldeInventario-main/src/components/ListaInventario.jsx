import React, { useEffect, useState } from "react";
import { listarInventario, agregarInventario, eliminarInventario, listarProductos, eliminarCantidadInventario } from "../services/consultas";
import "./Inventario.css";
import MovimientoModal from "./MovimientoModal";

function ListaInventario({ visible }) {
  const [inventario, setInventario] = useState([]);
  const [productos, setProductos] = useState([]); // Lista de productos disponibles
  const [error, setError] = useState("");
  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [agregarProductoId, setAgregarProductoId] = useState("");
  const [agregarCantidad, setAgregarCantidad] = useState("");
  const [agregarBodegaId, setAgregarBodegaId] = useState("");
  const [eliminarProductoId, setEliminarProductoId] = useState("");
  const [eliminarBodegaId, setEliminarBodegaId] = useState("");
  const [cantidadAEliminar, setCantidadAEliminar] = useState("");
  const [modalMovimientoVisible, setModalMovimientoVisible] = useState(false);

  const fetchInventario = async () => {
        try {
          const resultado = await listarInventario();
          setInventario(resultado);
        } catch (err) {
          setError("No se pudo listar el inventario. Inténtalo de nuevo.");
        }
      };

      const fetchProductos = async () => {
        try {
          const resultado = await listarProductos();
          setProductos(resultado);
        } catch (err) {
          setError("No se pudo listar los productos. Inténtalo de nuevo.");
        }
      };

  useEffect(() => {
    if (visible) {
      fetchInventario();
      fetchProductos();
    }
  }, [visible]);

  const abrirModalAgregar = () => {
    setAgregarProductoId("");
    setAgregarCantidad("");
    setAgregarBodegaId("");
    setModalAgregar(true);
  };

  const cerrarModalAgregar = () => {
    setModalAgregar(false);
    setAgregarProductoId("");
    setAgregarCantidad("");
    setAgregarBodegaId("");
  };

  const abrirModalEliminar = (item) => {
    setEliminarProductoId(item.producto_id);
    setEliminarBodegaId(item.bodega_id);
    setCantidadAEliminar("");
    setModalEliminar(true);
  };

  const cerrarModalEliminar = () => {
    setEliminarProductoId("");
    setEliminarBodegaId("");
    setCantidadAEliminar("");
    setModalEliminar(false);
  };

  const handleAgregarInventario = async (e) => {
    e.preventDefault();
    try {
      // Buscar el nombre del producto en la lista de productos
      const productoSeleccionado = productos.find((p) => p.producto_id === parseInt(agregarProductoId, 10));

      if (!productoSeleccionado) {
        setError("El producto seleccionado no existe.");
        return;
      }

      const nuevoItem = {
        producto_id: parseInt(agregarProductoId, 10), // Convertir a entero
        producto_nombre: productoSeleccionado.producto_nombre, // Obtener el nombre del producto
        bodega_id: parseInt(agregarBodegaId, 10), // Convertir a entero
        inventario_cantidad: parseInt(agregarCantidad, 10), // Convertir a entero
      };

      // Llamar al servicio para agregar o actualizar el inventario
      const respuesta = await agregarInventario(nuevoItem);

      // Actualizar el estado del inventario con la respuesta del backend
      const inventarioActualizado = respuesta.inventario;
      const existeEnInventario = inventario.some(
        (item) =>
          item.producto_id === inventarioActualizado.producto_id &&
          item.bodega_id === inventarioActualizado.bodega_id
      );

      if (existeEnInventario) {
        // Si ya existe, actualizar la cantidad en el estado
        setInventario(
          inventario.map((item) =>
            item.producto_id === inventarioActualizado.producto_id &&
            item.bodega_id === inventarioActualizado.bodega_id
              ? { ...item, inventario_cantidad: inventarioActualizado.inventario_cantidad }
              : item
          )
        );
      } else {
        // Si no existe, agregar el nuevo registro al estado
        setInventario([...inventario, inventarioActualizado]);
      }

      cerrarModalAgregar();
    } catch (err) {
      setError("No se pudo agregar el producto al inventario. Inténtalo de nuevo.");
      console.error(err);
    }
  };

  const handleEliminarCantidad = async (e) => {
    e.preventDefault();
    try {
      const datos = {
        producto_id: parseInt(eliminarProductoId, 10),
        bodega_id: parseInt(eliminarBodegaId, 10),
        cantidad_a_eliminar: parseInt(cantidadAEliminar, 10),
      };

      const respuesta = await eliminarCantidadInventario(datos);

      const inventarioActualizado = respuesta.inventario;
      setInventario(
        inventario.map((item) =>
          item.producto_id === inventarioActualizado.producto_id &&
          item.bodega_id === inventarioActualizado.bodega_id
            ? { ...item, inventario_cantidad: inventarioActualizado.inventario_cantidad }
            : item
        )
      );

      cerrarModalEliminar();
    } catch (err) {
      setError("No se pudo eliminar la cantidad del inventario. Inténtalo de nuevo.");
      console.error(err);
    }
  };

  const handleEliminarInventario = async (inventarioId) => {
    try {
      await eliminarInventario(inventarioId);
      setInventario(inventario.filter((item) => item.inventario_id !== inventarioId));
    } catch (err) {
      setError("No se pudo eliminar el inventario. Inténtalo de nuevo.");
        console.error(err);
    }
  };

  const abrirModalMovimiento = () => {
    setModalMovimientoVisible(true);
  };

  const cerrarModalMovimiento = () => {
    setModalMovimientoVisible(false);
  };

  const handleActualizar = () => {
    fetchInventario();
    fetchProductos();
  };

  if (!visible) return null;

  return (
    <div className="inventario">
      <h2 className="inventario-title">Gestión de Inventario</h2>
      <div className="inventario-botones">
        <button onClick={abrirModalAgregar} style={{ marginBottom: "10px" }}>
          Agregar producto a Inventario
        </button>
        <button onClick={abrirModalMovimiento}>Registrar Movimiento</button>
        <button onClick={handleActualizar} title="Actualizar Inventario" style={{ marginLeft: "10px" }}>
          🔄 Actualizar
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table className="tabla-inventario">
        <thead>
          <tr>
            <th>ID del Producto</th>
            <th>Nombre del Producto</th>
            <th>Cantidad</th>
            <th>ID de bodega</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {inventario.map((item) => (
            <tr key={item.inventario_id}>
              <td>{item.producto_id}</td>
              <td>{item.producto_nombre}</td>
              <td>{item.inventario_cantidad}</td>
              <td>{item.bodega_id}</td>
              <td>
                <button
                  className="botonEliminar"
                  onClick={() => handleEliminarInventario(item.inventario_id)}
                  title="Eliminar"
                >
                  ✖️
                </button>
                <button
                  className="botonEliminarCantidad"
                  onClick={() => abrirModalEliminar(item)}
                  title="Eliminar Cantidad"
                >
                  ➖
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Agregar */}
      {modalAgregar && (
        <div className="inventario-modal-fondo">
          <div className="inventario-modal-contenido">
            <h3>Agregar Inventario</h3>
            <form onSubmit={handleAgregarInventario}>
              <label>
                Producto:
                <select
                  value={agregarProductoId}
                  onChange={(e) => setAgregarProductoId(e.target.value)}
                  required
                >
                  <option value="">Seleccione un producto</option>
                  {productos.map((producto) => (
                    <option key={producto.producto_id} value={producto.producto_id}>
                      {producto.producto_nombre}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Cantidad:
                <input
                  type="number"
                  value={agregarCantidad}
                  onChange={(e) => setAgregarCantidad(e.target.value)}
                  required
                />
              </label>
              <label>
                Bodega ID:
                <input
                  type="text"
                  value={agregarBodegaId}
                  onChange={(e) => setAgregarBodegaId(e.target.value)}
                  required
                />
              </label>
              <div className="inventario-modal-acciones">
                <button type="submit" className="inventario-btn-guardar">Agregar</button>
                <button type="button" className="inventario-btn-cancelar" onClick={cerrarModalAgregar}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {modalEliminar && (
        <div className="inventario-modal-fondo">
          <div className="inventario-modal-contenido">
            <h3>Eliminar Cantidad del Inventario</h3>
            <form onSubmit={handleEliminarCantidad}>
              <label>
                Producto ID:
                <input type="text" value={eliminarProductoId} disabled />
              </label>
              <label>
                Bodega ID:
                <input type="text" value={eliminarBodegaId} disabled />
              </label>
              <label>
                Cantidad a Eliminar:
                <input
                  type="number"
                  value={cantidadAEliminar}
                  onChange={(e) => setCantidadAEliminar(e.target.value)}
                  required
                />
              </label>
              <div className="inventario-modal-acciones">
                <button type="submit" className="inventario-btn-guardar">Eliminar</button>
                <button type="button" className="inventario-btn-cancelar" onClick={cerrarModalEliminar}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <MovimientoModal
        visible={modalMovimientoVisible}
        actualizaVisibilidad={cerrarModalMovimiento}
      />
    </div>
  );
}

export default ListaInventario;