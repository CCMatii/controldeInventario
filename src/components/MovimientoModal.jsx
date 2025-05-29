import React, { useState, useEffect, useContext } from "react";
import { listarProductos, listarBodegas, agregarMovimiento } from "../services/consultas";
import { ContextoAutenticacion } from "../context/auntenticarContext";
import "./MovimientoModal.css";

function MovimientoModal({ visible, actualizaVisibilidad }) {
  const { credenciales } = useContext(ContextoAutenticacion);
  const [productos, setProductos] = useState([]);
  const [bodegas, setBodegas] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [descripcionMovimiento, setDescripcionMovimiento] = useState("");
  const [bodegaOrigen, setBodegaOrigen] = useState("");
  const [bodegaDestino, setBodegaDestino] = useState("");
  const [cantidadMovimiento, setCantidadMovimiento] = useState("");
  const [error, setError] = useState("");

  const handleListarProductos = async () => {
    try {
      const resultado = await listarProductos();
      setProductos(resultado);
    } catch (error) {
      setError("No se pudieron cargar los productos. Inténtalo de nuevo.");
    }
  };

  const handleListarBodegas = async () => {
    try {
      const resultado = await listarBodegas();
      setBodegas(resultado);
    } catch (error) {
      setError("No se pudieron cargar las bodegas. Inténtalo de nuevo.");
    }
  };

  const cerrarModal = () => {
    actualizaVisibilidad(false);
    setProductoSeleccionado("");
    setDescripcionMovimiento("");
    setBodegaOrigen("");
    setBodegaDestino("");
    setCantidadMovimiento("");
    setError("");
  };

  const handleRegistrarMovimiento = async (e) => {
    e.preventDefault();
    try {
      if (!productoSeleccionado || !bodegaOrigen || !bodegaDestino || !cantidadMovimiento) {
        setError("Todos los campos son obligatorios.");
        return;
      }

      const movimiento = {
        movimiento_producto: parseInt(productoSeleccionado, 10),
        movimiento_descripcion: descripcionMovimiento,
        bodega_origen: parseInt(bodegaOrigen, 10),
        bodega_destino: parseInt(bodegaDestino, 10),
        cantidad: parseInt(cantidadMovimiento, 10),
        movimiento_usuario: credenciales.usuario_id,
      };

      const respuesta = await agregarMovimiento(movimiento);
      console.log("Movimiento registrado:", respuesta);

      cerrarModal();
    } catch (error) {
      console.error("Error al registrar el movimiento:", error);
      setError("No se pudo registrar el movimiento. Inténtalo de nuevo.");
    }
  };

  useEffect(() => {
    if (visible) {
      handleListarProductos();
      handleListarBodegas();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="listar-modal-fondo">
      <div className="listar-modal-contenido">
        <button className="listar-modal-cerrar" onClick={cerrarModal}>✖️</button>
        <h2 className="title-listamovimiento">Registrar Movimiento</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleRegistrarMovimiento}>
          <label>
            Producto:
            <select
              value={productoSeleccionado}
              onChange={(e) => setProductoSeleccionado(e.target.value)}
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
            Descripción:
            <input
              type="text"
              value={descripcionMovimiento}
              onChange={(e) => setDescripcionMovimiento(e.target.value)}
              required
            />
          </label>
          <label>
            Bodega Origen:
            <select
              value={bodegaOrigen}
              onChange={(e) => setBodegaOrigen(e.target.value)}
              required
            >
              <option value="">Seleccione una bodega</option>
              {bodegas.map((bodega) => (
                <option key={bodega.bodega_id} value={bodega.bodega_id}>
                  {bodega.bodega_id} {/* Mostrar solo el número de la bodega */}
                </option>
              ))}
            </select>
          </label>
          <label>
            Bodega Destino:
            <select
              value={bodegaDestino}
              onChange={(e) => setBodegaDestino(e.target.value)}
              required
            >
              <option value="">Seleccione una bodega</option>
              {bodegas.map((bodega) => (
                <option key={bodega.bodega_id} value={bodega.bodega_id}>
                  {bodega.bodega_id} {/* Mostrar solo el número de la bodega */}
                </option>
              ))}
            </select>
          </label>
          <label>
            Cantidad:
            <input
              type="number"
              value={cantidadMovimiento}
              onChange={(e) => setCantidadMovimiento(e.target.value)}
              required
            />
          </label>
          <div className="listar-modal-acciones">
            <button type="submit" className="listar-modal-btn-guardar">Registrar</button>
            <button type="button" className="listar-modal-btn-cancelar" onClick={cerrarModal}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MovimientoModal;