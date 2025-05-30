import React, { useEffect, useState } from "react";
import { listarMovimientos } from "../services/consultas"; // Asegúrate de tener este servicio
import "./ListaMovimientos.css";

function ListMovimientos({ visible, actualizaVisibilidad }) {
  const [movimientos, setMovimientos] = useState([]);
  const [error, setError] = useState("");

  const handleListarMovimientos = async () => {
    try {
      const resultado = await listarMovimientos(); // Llama al servicio para obtener los movimientos
      setMovimientos(resultado);
    } catch (error) {
      setError("No se pudo listar los movimientos. Inténtalo de nuevo.");
    }
  };

  useEffect(() => {
    if (visible) {
      handleListarMovimientos();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="listar-modal-fondo">
      <div className="listar-modal-contenido">
        <button className="listar-modal-cerrar" onClick={() => actualizaVisibilidad(false)}>✖️</button>
        <h2 className="title-listamovimientos">Lista de Movimientos</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <table className="tabla-movimientos">
          <thead>
            <tr>
              <th>ID Movimiento</th>
              <th>Producto</th>
              <th>Descripción</th>
              <th>Bodega Origen</th>
              <th>Bodega Destino</th>
              <th>Cantidad</th>
              <th>Usuario</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map((movimiento) => (
              <tr key={movimiento.movimiento_id}>
                <td>{movimiento.movimiento_id}</td>
                <td>{movimiento.movimiento_producto}</td>
                <td>{movimiento.movimiento_descripcion}</td>
                <td>{movimiento.bodega_origen}</td>
                <td>{movimiento.bodega_destino}</td>
                <td>{movimiento.cantidad}</td>
                <td>{movimiento.movimiento_usuario}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListMovimientos;