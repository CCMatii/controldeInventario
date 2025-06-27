import React, { useState, useEffect } from "react";
import { listarBodegas, eliminarBodega, modificarBodega, agregarBodega } from "../services/consultas";
import "./ListaBodega.css";

function ListaBodega({ visible, actualizaVisibilidad }) {
  const [bodegas, setBodegas] = useState([]);
  const [error, setError] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [bodegaEdit, setBodegaEdit] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevaUbicacion, setNuevaUbicacion] = useState("");
  const [modalAgregar, setModalAgregar] = useState(false);
  const [nuevoNombreAgregar, setNuevoNombreAgregar] = useState("");
  const [nuevaUbicacionAgregar, setNuevaUbicacionAgregar] = useState("");

  // Restricción: mínimo 3 caracteres, no comienza con espacio/especial, solo letras/números/espacios
  const campoValido = (valor) => {
    const val = valor.trim();
    return (
      val.length >= 3 &&
      /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ]/.test(val) &&
      /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ .,'-]+$/.test(val)
    );
  };

  const handleListarBodegas = async () => {
    try {
      const resultado = await listarBodegas();
      setBodegas(resultado);
    } catch (error) {
      setError("No se pudo listar las bodegas. Inténtalo de nuevo.");
    }
  };

  const handleEliminarBodega = async (bodegaId) => {
    try {
      await eliminarBodega(bodegaId);
      setBodegas(bodegas.filter((bodega) => bodega.bodega_id !== bodegaId));
    } catch (error) {
      setError("No se pudo eliminar la bodega. Inténtalo de nuevo.");
    }
  };

  const abrirModal = (bodega) => {
    setBodegaEdit(bodega);
    setNuevoNombre(bodega.bodega_nombre);
    setNuevaUbicacion(bodega.bodega_ubicacion);
    setError("");
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setBodegaEdit(null);
    setNuevoNombre("");
    setNuevaUbicacion("");
    setError("");
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!campoValido(nuevoNombre) || !campoValido(nuevaUbicacion)) {
      setError(
        "Nombre y ubicación deben tener al menos 3 caracteres, no comenzar con espacio o carácter especial, y solo contener letras, números y espacios."
      );
      return;
    }
    try {
      await modificarBodega({
        id: bodegaEdit.bodega_id,
        nombre: nuevoNombre.trim(),
        ubicacion: nuevaUbicacion.trim(),
      });
      setBodegas(
        bodegas.map((b) =>
          b.bodega_id === bodegaEdit.bodega_id
            ? {
                ...b,
                bodega_nombre: nuevoNombre.trim(),
                bodega_ubicacion: nuevaUbicacion.trim(),
              }
            : b
        )
      );
      cerrarModal();
    } catch (error) {
      setError("No se pudo modificar la bodega. Inténtalo de nuevo.");
    }
  };

  const abrirModalAgregar = () => {
    setNuevoNombreAgregar("");
    setNuevaUbicacionAgregar("");
    setError("");
    setModalAgregar(true);
  };

  const cerrarModalAgregar = () => {
    setModalAgregar(false);
    setNuevoNombreAgregar("");
    setNuevaUbicacionAgregar("");
    setError("");
  };

  const handleAgregarBodega = async (e) => {
    e.preventDefault();
    if (!campoValido(nuevoNombreAgregar) || !campoValido(nuevaUbicacionAgregar)) {
      setError(
        "Nombre y ubicación deben tener al menos 3 caracteres, no comenzar con espacio o carácter especial, y solo contener letras, números y espacios."
      );
      return;
    }
    try {
      const nuevaBodega = await agregarBodega({
        nombre: nuevoNombreAgregar.trim(),
        ubicacion: nuevaUbicacionAgregar.trim(),
      });
      setBodegas([...bodegas, nuevaBodega]);
      cerrarModalAgregar();
    } catch (error) {
      setError("No se pudo agregar la bodega. Inténtalo de nuevo.");
    }
  };

  useEffect(() => {
    if (visible) {
      handleListarBodegas();
      setError("");
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="bodega-modal-fondo">
      <div className="bodega-modal-contenido">
        <button className="bodega-modal-cerrar" onClick={() => actualizaVisibilidad(false)}>✖️</button>
        <h2 className="bodega-title">Lista de Bodegas</h2>
        <button className="bodega-agregar-button" onClick={abrirModalAgregar}>Agregar Bodega</button>
        {error && <div className="bodega-error-modal">{error}</div>}
        <table className="bodega-tabla">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Ubicación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {bodegas.map((bodega) => (
              <tr key={bodega.bodega_id}>
                <td>{bodega.bodega_id}</td>
                <td>{bodega.bodega_nombre}</td>
                <td>{bodega.bodega_ubicacion}</td>
                <td>
                  <button
                    className="bodega-boton-editar"
                    onClick={() => abrirModal(bodega)}
                    title="Modificar"
                  >
                    ✏️
                  </button>
                  <button
                    className="bodega-boton-eliminar"
                    onClick={() => handleEliminarBodega(bodega.bodega_id)}
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
          <div className="bodega-modal-agregar-fondo">
            <div className="bodega-modal-agregar-contenido">
              <h3>Agregar Bodega</h3>
              {error && <div className="bodega-error-modal">{error}</div>}
              <form onSubmit={handleAgregarBodega}>
                <label>
                  Nombre:
                  <input
                    type="text"
                    value={nuevoNombreAgregar}
                    onChange={(e) => {
                      setNuevoNombreAgregar(e.target.value);
                      setError("");
                    }}
                    required
                  />
                </label>
                <label>
                  Ubicación:
                  <input
                    type="text"
                    value={nuevaUbicacionAgregar}
                    onChange={(e) => {
                      setNuevaUbicacionAgregar(e.target.value);
                      setError("");
                    }}
                    required
                  />
                </label>
                <div className="bodega-modal-agregar-acciones">
                  <button type="submit" className="bodega-modal-agregar-btn-guardar">Agregar</button>
                  <button type="button" className="bodega-modal-agregar-btn-cancelar" onClick={cerrarModalAgregar}>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {modalAbierto && (
          <div className="bodega-modal-fondo">
            <div className="bodega-modal-contenido">
              <h3>Modificar Bodega</h3>
              {error && <div className="bodega-error-modal">{error}</div>}
              <form onSubmit={handleGuardar}>
                <label>
                  Nombre:
                  <input
                    type="text"
                    value={nuevoNombre}
                    onChange={(e) => {
                      setNuevoNombre(e.target.value);
                      setError("");
                    }}
                    required
                  />
                </label>
                <label>
                  Ubicación:
                  <input
                    type="text"
                    value={nuevaUbicacion}
                    onChange={(e) => {
                      setNuevaUbicacion(e.target.value);
                      setError("");
                    }}
                    required
                  />
                </label>
                <div className="bodega-modal-acciones">
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

export default ListaBodega;