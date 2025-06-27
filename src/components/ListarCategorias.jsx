import React, { useState, useEffect } from "react";
import { listarCategorias, agregarCategoria, modificarCategoria, eliminarCategoria } from "../services/consultas";
import "./ListarProductos.css";

function ListarCategorias({ visible, onClose }) {
  const [categorias, setCategorias] = useState([]);
  const [errorGeneral, setErrorGeneral] = useState(""); // Para errores generales (listar/eliminar)
  const [errorAgregar, setErrorAgregar] = useState(""); // Para el modal de agregar
  const [errorEditar, setErrorEditar] = useState("");   // Para el modal de editar
  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [categoriaEdit, setCategoriaEdit] = useState(null);
  const [nombre, setNombre] = useState("");
  const [nombreOriginal, setNombreOriginal] = useState("");
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    if (visible) {
      cargarCategorias();
    }
  }, [visible]);

  const cargarCategorias = async () => {
    try {
      const resultado = await listarCategorias();
      setCategorias(resultado);
    } catch (error) {
      setErrorGeneral("No se pudieron cargar las categorías.");
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

  const abrirModalEditar = (cat) => {
    setCategoriaEdit(cat);
    setNombre(cat.categoria_nombre);
    setNombreOriginal(cat.categoria_nombre);
    setDescripcion(cat.categoria_descripcion);
    setModalEditar(true);
    setErrorEditar("");
  };

  const cerrarModalEditar = () => {
    setModalEditar(false);
    setCategoriaEdit(null);
    setNombre("");
    setDescripcion("");
    setErrorEditar("");
  };

  const campoValido = (valor) => {
    const val = valor.trim();
    return (
      val.length >= 3 &&
      /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ]/.test(val) &&
      /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ .,'-]+$/.test(val)
    );
  };

  const handleAgregar = async (e) => {
    e.preventDefault();
    if (!campoValido(nombre) || !campoValido(descripcion)) {
      setErrorAgregar("Nombre y descripción deben tener al menos 3 caracteres, no comenzar con espacio o carácter especial, y solo contener letras, números y espacios.");
      return;
    }
    try {
      await agregarCategoria({ categoria_nombre: nombre, categoria_descripcion: descripcion });
      await cargarCategorias();
      cerrarModalAgregar();
    } catch (err) {
      setErrorAgregar("No se pudo agregar la categoría.");
    }
  };

  const handleEditar = async (e) => {
    e.preventDefault();
    if (!campoValido(nombre) || !campoValido(descripcion)) {
      setErrorEditar("Nombre y descripción deben tener al menos 3 caracteres, no comenzar con espacio o carácter especial, y solo contener letras, números y espacios.");
      return;
    }
    try {
      await modificarCategoria({
        nombre_original: nombreOriginal,
        categoria_nombre: nombre,
        categoria_descripcion: descripcion,
      });
      await cargarCategorias();
      cerrarModalEditar();
    } catch (err) {
      setErrorEditar("No se pudo modificar la categoría.");
    }
  };

  const handleEliminar = async (nombreCategoria) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta categoría?")) return;
    try {
      await eliminarCategoria(nombreCategoria);
      await cargarCategorias();
    } catch (err) {
      setErrorGeneral("No se pudo eliminar la categoría.");
    }
  };

  if (!visible) return null;

  return (
    <div className="listar-modal-fondo">
      <div className="listar-modal-contenido">
        <button className="listar-modal-cerrar" onClick={onClose}>✖️</button>
        <h2 className="title-listaproductos">Categorías</h2>
        <button className="agregarbutton" onClick={abrirModalAgregar}>Agregar Categoría</button>
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
            {categorias.map((cat) => (
              <tr key={cat.categoria_nombre}>
                <td>{cat.categoria_nombre}</td>
                <td>{cat.categoria_descripcion}</td>
                <td>
                  <button className="botonEditar" onClick={() => abrirModalEditar(cat)} title="Modificar">✏️</button>
                  <button className="botonEliminar" onClick={() => handleEliminar(cat.categoria_nombre)} title="Eliminar">✖️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal Agregar */}
        {modalAgregar && (
          <div className="listar-modal-agregar-fondo">
            <div className="listar-modal-agregar-contenido">
              <h3>Agregar Categoría</h3>
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

        {/* Modal Editar */}
        {modalEditar && (
          <div className="listar-modal-agregar-fondo">
            <div className="listar-modal-agregar-contenido">
              <h3>Modificar Categoría</h3>
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

export default ListarCategorias;