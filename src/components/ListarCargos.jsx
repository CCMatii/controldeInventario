import React, { useState, useEffect } from "react";
import { listarCargos, agregarCargo, modificarCargo, eliminarCargo } from "../services/consultas";
import "./Listar.css";

function ListarCargos({ visible, onClose }) {
  const [cargos, setCargos] = useState([]);
  const [errorGeneral, setErrorGeneral] = useState(""); 
  const [errorAgregar, setErrorAgregar] = useState(""); 
  const [errorEditar, setErrorEditar] = useState("");  
  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [cargoEdit, setCargoEdit] = useState(null);
  const [nombre, setNombre] = useState("");
  const [nombreOriginal, setNombreOriginal] = useState("");
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    if (visible) {
      cargarCargos();
    }
  }, [visible]);

  const cargarCargos = async () => {
    try {
      const resultado = await listarCargos();
      setCargos(resultado);
    } catch (error) {
      setErrorGeneral("No se pudieron cargar los cargos.");
    }
  };

  const abrirModalAgregar = () => {
    setNombre("");
    setDescripcion("");
    setModalAgregar(true);
    setErrorAgregar("");
  };

  const cerrarModalAgregar = () => {
    setModalAgregar(false);
    setNombre("");
    setDescripcion("");
    setErrorAgregar("");
  };

  const abrirModalEditar = (cargo) => {
    setCargoEdit(cargo);
    setNombre(cargo.cargo_nombre);
    setNombreOriginal(cargo.cargo_nombre);
    setDescripcion(cargo.cargo_descripcion);
    setModalEditar(true);
    setErrorEditar("");
  };

  const cerrarModalEditar = () => {
    setModalEditar(false);
    setCargoEdit(null);
    setNombre("");
    setDescripcion("");
    setErrorEditar("");
  };

  const handleAgregar = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setErrorAgregar("El nombre es obligatorio.");
      return;
    }
    try {
      await agregarCargo({ cargo_nombre: nombre, cargo_descripcion: descripcion });
      await cargarCargos();
      cerrarModalAgregar();
    } catch (err) {
      setErrorAgregar("No se pudo agregar el cargo.");
    }
  };

  const handleEditar = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setErrorEditar("El nombre es obligatorio.");
      return;
    }
    try {
      await modificarCargo({
        nombre_original: nombreOriginal,
        cargo_nombre: nombre,
        cargo_descripcion: descripcion,
      });
      await cargarCargos();
      cerrarModalEditar();
    } catch (err) {
      setErrorEditar("No se pudo modificar el cargo.");
    }
  };

  const handleEliminar = async (nombreCargo) => {
    if (!window.confirm("¿Seguro que deseas eliminar este cargo?")) return;
    try {
      await eliminarCargo(nombreCargo);
      await cargarCargos();
    } catch (err) {
      setErrorGeneral("No se pudo eliminar el cargo.");
    }
  };

  if (!visible) return null;

  return (
    <div className="listar-modal-fondo">
      <div className="listar-modal-contenido">
        <button className="listar-modal-cerrar" onClick={onClose}>✖️</button>
        <h2 className="title-listaproductos">Cargos</h2>
        <button className="agregarbutton" onClick={abrirModalAgregar}>Agregar Cargo</button>
        {errorGeneral && <p style={{ color: "red" }}>{errorGeneral}</p>}
        <table className="tabla-productos">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargos.map((cargo) => (
              <tr key={cargo.cargo_nombre}>
                <td>{cargo.cargo_nombre}</td>
                <td>{cargo.cargo_descripcion}</td>
                <td>
                  <button className="botonEditar" onClick={() => abrirModalEditar(cargo)} title="Modificar">✏️</button>
                  <button className="botonEliminar" onClick={() => handleEliminar(cargo.cargo_nombre)} title="Eliminar">✖️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal Agregar */}
        {modalAgregar && (
          <div className="listar-modal-agregar-fondo">
            <div className="listar-modal-agregar-contenido">
              <h3>Agregar Cargo</h3>
              {errorAgregar && <p style={{ color: "red" }}>{errorAgregar}</p>}
              <form onSubmit={handleAgregar}>
                <label>
                  Nombre:
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Descripción:
                  <input
                    type="text"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
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

        {modalEditar && (
          <div className="listar-modal-agregar-fondo">
            <div className="listar-modal-agregar-contenido">
              <h3>Modificar Cargo</h3>
              {errorEditar && <p style={{ color: "red" }}>{errorEditar}</p>}
              <form onSubmit={handleEditar}>
                <label>
                  Nombre:
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Descripción:
                  <input
                    type="text"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                  />
                </label>
                <div className="listar-modal-agregar-acciones">
                  <button type="submit" className="listar-modal-agregar-btn-guardar">Guardar</button>
                  <button type="button" className="listar-modal-agregar-btn-cancelar" onClick={cerrarModalEditar}>
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

export default ListarCargos;