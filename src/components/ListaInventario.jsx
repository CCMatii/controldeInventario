import React, { useEffect, useState } from "react";
import { listarInventario, agregarInventario, eliminarInventario, listarProductos, eliminarCantidadInventario, listarBodegas } from "../services/consultas";
import "./ListaInventario.css";
import MovimientoModal from "./MovimientoModal";

function ListaInventario({ visible }) {
  const [inventario, setInventario] = useState([]);
  const [productos, setProductos] = useState([]); // Lista de productos disponibles
  const [errorGeneral, setErrorGeneral] = useState("");
  const [errorAgregarCantidad, setErrorAgregarCantidad] = useState("");
  const [errorEliminarCantidad, setErrorEliminarCantidad] = useState("");
  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [agregarProductoId, setAgregarProductoId] = useState("");
  const [agregarCantidad, setAgregarCantidad] = useState("");
  const [agregarBodegaId, setAgregarBodegaId] = useState("");
  const [eliminarProductoId, setEliminarProductoId] = useState("");
  const [eliminarBodegaId, setEliminarBodegaId] = useState("");
  const [cantidadAEliminar, setCantidadAEliminar] = useState("");
  const [modalMovimientoVisible, setModalMovimientoVisible] = useState(false);
  const [bodegas, setBodegas] = useState([]); // NUEVO
  const [bodegaFiltro, setBodegaFiltro] = useState(""); // NUEVO

  const fetchInventario = async () => {
        try {
          const resultado = await listarInventario();
          setInventario(resultado);
        } catch (err) {
          setErrorGeneral("No se pudo listar el inventario. Inténtalo de nuevo.");
        }
      };

      const fetchProductos = async () => {
        try {
          const resultado = await listarProductos();
          setProductos(resultado);
        } catch (err) {
          setErrorGeneral("No se pudo listar los productos. Inténtalo de nuevo.");
        }
      };

      const fetchBodegas = async () => {
        try {
          const resultado = await listarBodegas();
          setBodegas(resultado);
        } catch (err) {
          setErrorGeneral("No se pudieron listar las bodegas. Inténtalo de nuevo.");
        }
      };

  useEffect(() => {
    if (visible) {
      fetchInventario();
      fetchProductos();
      fetchBodegas();
    }
  }, [visible]);

  const abrirModalAgregar = () => {
    fetchProductos();
    setAgregarProductoId("");
    setAgregarCantidad("");
    setAgregarBodegaId("");
    setModalAgregar(true);
    setErrorAgregarCantidad("");
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
    setErrorEliminarCantidad("");
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
      if (parseInt(agregarCantidad, 10) <= 0) {
        setErrorAgregarCantidad("La cantidad debe ser un número positivo.");
        return;
      }

      const productoSeleccionado = productos.find((p) => p.producto_id === parseInt(agregarProductoId, 10));
      if (!productoSeleccionado) {
        setErrorAgregarCantidad("El producto seleccionado no existe.");
        return;
      }

      const nuevoItem = {
        producto_id: parseInt(agregarProductoId, 10),
        producto_nombre: productoSeleccionado.producto_nombre,
        bodega_id: parseInt(agregarBodegaId, 10),
        inventario_cantidad: parseInt(agregarCantidad, 10),
      };

      const respuesta = await agregarInventario(nuevoItem);
      const inventarioActualizado = respuesta.inventario;

      const existeEnInventario = inventario.some(
        (item) =>
          item.producto_id === inventarioActualizado.producto_id &&
          item.bodega_id === inventarioActualizado.bodega_id
      );

      if (existeEnInventario) {
        setInventario(
          inventario.map((item) =>
            item.producto_id === inventarioActualizado.producto_id &&
            item.bodega_id === inventarioActualizado.bodega_id
              ? { ...item, inventario_cantidad: inventarioActualizado.inventario_cantidad }
              : item
          )
        );
      } else {
        setInventario([...inventario, inventarioActualizado]);
      }

      cerrarModalAgregar();
    } catch (err) {
      setErrorAgregarCantidad("No se pudo agregar el producto al inventario. Inténtalo de nuevo.");
      console.error(err);
    }
  };

  const handleEliminarCantidad = async (e) => {
    e.preventDefault();
    try {
      if (parseInt(cantidadAEliminar, 10) <= 0) {
        setErrorEliminarCantidad("La cantidad debe ser un número positivo.");
        return;
      }

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
      setErrorEliminarCantidad("No se pudo eliminar la cantidad del inventario. Inténtalo de nuevo.");
      console.error(err);
    }
  };

  const handleEliminarInventario = async (inventarioId) => {
    try {
      await eliminarInventario(inventarioId);
      setInventario(inventario.filter((item) => item.inventario_id !== inventarioId));
    } catch (err) {
      setErrorGeneral("No se pudo eliminar el inventario. Inténtalo de nuevo.");
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

  const inventarioFiltrado = bodegaFiltro
    ? inventario.filter((item) => String(item.bodega_id) === String(bodegaFiltro))
    : inventario;

  if (!visible) return null;

  return (
    <div className="inventario">
      <h2 className="inventario-title">Gestión de Inventario</h2>
      <div className="inventario-botones">
        <button className="btn flash-slide flash-slide--black" onClick={abrirModalAgregar} style={{ marginBottom: "10px" }}>
          Agregar a inventario
        </button>
        <button className="btn flash-slide flash-slide--black" onClick={abrirModalMovimiento}>Registrar Movimiento</button>
        <div className="inventario-filtro">
        <label htmlFor="bodegaFiltro">Filtrar por Bodega:</label>
        <select
          value={bodegaFiltro}
          onChange={(e) => setBodegaFiltro(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          <option value="">Todas las bodegas</option>
          {bodegas.map((bodega) => (
            <option key={bodega.bodega_id} value={bodega.bodega_id}>
              {bodega.bodega_nombre || bodega.bodega_id}
            </option>
          ))}
        </select>
        </div>
      </div>
      {errorGeneral && <p style={{ color: "red" }}>{errorGeneral}</p>}
      <table className="tabla-inventario">
        <thead>
          <tr>
            <th>ID del Producto</th>
            <th>Nombre del Producto</th>
            <th>Cantidad</th>
            <th>Bodega</th> {/* Cambia el encabezado */}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {inventarioFiltrado.map((item) => {
            const bodega = bodegas.find(b => String(b.bodega_id) === String(item.bodega_id));
            return (
              <tr key={item.inventario_id}>
                <td>{item.producto_id}</td>
                <td>{item.producto_nombre}</td>
                <td>{item.inventario_cantidad}</td>
                <td>{bodega ? bodega.bodega_nombre : item.bodega_id}</td> {/* Muestra el nombre o el id si no se encuentra */}
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
            );
          })}
        </tbody>
      </table>

      {/* Modal Agregar */}
      {modalAgregar && (
        <div className="inventario-modal-fondo">
          <div className="inventario-modal-contenido">
            <h3>Agregar Inventario</h3>
            {errorAgregarCantidad && <p style={{ color: "red" }}>{errorAgregarCantidad}</p>}
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
                  min="1"
                  value={agregarCantidad}
                  onChange={(e) => setAgregarCantidad(e.target.value)}
                  required
                />
              </label>
              <label>
                Bodega:
                <select
                  value={agregarBodegaId}
                  onChange={(e) => setAgregarBodegaId(e.target.value)}
                  required
                >
                  <option value="">Seleccione una bodega</option>
                  {bodegas.map((bodega) => (
                    <option key={bodega.bodega_id} value={bodega.bodega_id}>
                      {bodega.bodega_nombre || bodega.bodega_id}
                    </option>
                  ))}
                </select>
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

      {modalEliminar && (
        <div className="inventario-modal-fondo">
          <div className="inventario-modal-contenido">
            <h3>Eliminar Cantidad del Inventario</h3>
            {errorEliminarCantidad && <p style={{ color: "red" }}>{errorEliminarCantidad}</p>}
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
                  min="1"
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
        onMovimientoRealizado={handleActualizar}
      />
    </div>
  );
}

export default ListaInventario;