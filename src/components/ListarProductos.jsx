import React, { useState, useEffect } from "react";
import { listarProductos, eliminarProducto, modificarProducto, agregarProducto, listarCategorias, listarProveedores } from "../services/consultas";
import ListarCategorias from "./ListarCategorias";
import "./ListarProductos.css";

function ListarProductos({ visible, actualizaVisibilidad }) {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [errorGeneral, setErrorGeneral] = useState(""); // Para errores generales
  const [errorAgregar, setErrorAgregar] = useState(""); // Para modal agregar
  const [errorModificar, setErrorModificar] = useState(""); // Para modal modificar
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEdit, setProductoEdit] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");
  const [nuevoProovedor, setNuevoProovedor] = useState("");
  const [nuevoCategoria, setNuevoCategoria] = useState("");
  const [modalAgregar, setModalAgregar] = useState(false);
  const [nuevoNombreAgregar, setNuevoNombreAgregar] = useState("");
  const [nuevaDescripcionAgregar, setNuevaDescripcionAgregar] = useState("");
  const [nuevoProovedorAgregar, setNuevoProovedorAgregar] = useState("");
  const [modalCategorias, setModalCategorias] = useState(false);

  // Restricciones
  const campoValido = (valor) => {
    const val = valor.trim();
    return (
      val.length >= 3 &&
      /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ]/.test(val) &&
      /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ .,'-]+$/.test(val)
    );
  };
  const validarProveedor = (prov) => /^\d+$/.test(prov.trim()) && parseInt(prov, 10) > 0;

  useEffect(() => {
    if (visible) {
      handleListarProductos();
      handleListarCategorias();
      handleListarProveedores(); // Nuevo
    }
  }, [visible]);

  const handleListarProductos = async () => {
    try {
      const resultado = await listarProductos();
      setProductos(resultado);
    } catch (error) {
      setErrorGeneral("No se pudo listar los productos. Inténtalo de nuevo.");
    }
  };

  const handleListarCategorias = async () => {
    try {
      const resultado = await listarCategorias();
      setCategorias(resultado);
    } catch (error) {
      setErrorGeneral("No se pudieron cargar las categorías.");
    }
  };

  const handleListarProveedores = async () => {
    try {
      const resultado = await listarProveedores();
      setProveedores(resultado);
    } catch (error) {
      setErrorGeneral("No se pudieron cargar los proveedores.");
    }
  };

  const handleEliminarProducto = async (productoId) => {
    try {
      await eliminarProducto(productoId);
      setProductos(productos.filter((producto) => producto.producto_id !== productoId));
    } catch (error) {
      setErrorGeneral("No se pudo eliminar el producto. Inténtalo de nuevo.");
    }
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (
      !campoValido(nuevoNombre) ||
      !campoValido(nuevaDescripcion) ||
      !validarProveedor(nuevoProovedor) ||
      !nuevoCategoria
    ) {
      setErrorModificar("Verifica que todos los campos sean válidos. Nombre y descripción mínimo 3 caracteres, sin comenzar con espacio o carácter especial. Selecciona un proveedor y categoria.");
      return;
    }
    try {
      await modificarProducto({
        id: productoEdit.producto_id,
        nombre: nuevoNombre.trim(),
        descripcion: nuevaDescripcion.trim(),
        proovedor: parseInt(nuevoProovedor, 10),
        categoria: nuevoCategoria,
      });
      setProductos(
        productos.map((p) =>
          p.producto_id === productoEdit.producto_id
            ? {
                ...p,
                producto_nombre: nuevoNombre.trim(),
                producto_descripcion: nuevaDescripcion.trim(),
                producto_proovedor: parseInt(nuevoProovedor, 10),
                producto_categoria: nuevoCategoria,
              }
            : p
        )
      );
      cerrarModal();
    } catch (error) {
      setErrorModificar("No se pudo modificar el producto. Inténtalo de nuevo.");
    }
  };

  const abrirModal = (producto) => {
    setProductoEdit(producto);
    setNuevoNombre(producto.producto_nombre);
    setNuevaDescripcion(producto.producto_descripcion);
    setNuevoProovedor(producto.producto_proovedor);
    setNuevoCategoria(producto.producto_categoria);
    setErrorModificar(""); // Limpiar error del modal modificar
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setProductoEdit(null);
    setNuevoNombre("");
    setNuevaDescripcion("");
    setNuevoProovedor("");
    setNuevoCategoria("");
    setErrorModificar("");
  };

  const abrirModalAgregar = () => {
    setNuevoNombreAgregar("");
    setNuevaDescripcionAgregar("");
    setNuevoProovedorAgregar("");
    setNuevoCategoria("");
    setErrorAgregar(""); // Limpiar error del modal agregar
    setModalAgregar(true);
  };

  const cerrarModalAgregar = () => {
    setModalAgregar(false);
    setNuevoNombreAgregar("");
    setNuevaDescripcionAgregar("");
    setNuevoProovedorAgregar("");
    setNuevoCategoria("");
    setErrorAgregar("");
  };

  const handleAgregarProducto = async (e) => {
    e.preventDefault();
    if (
      !campoValido(nuevoNombreAgregar) ||
      !campoValido(nuevaDescripcionAgregar) ||
      !validarProveedor(nuevoProovedorAgregar) ||
      !nuevoCategoria
    ) {
      setErrorAgregar("Verifica que todos los campos sean válidos. Nombre y descripción mínimo 3 caracteres, sin comenzar con espacio o carácter especial. Selecciona un proveedor y categoría.");
      return;
    }
    try {
      const nuevoProducto = await agregarProducto({
        producto_nombre: nuevoNombreAgregar.trim(),
        producto_descripcion: nuevaDescripcionAgregar.trim(),
        producto_proovedor: parseInt(nuevoProovedorAgregar, 10),
        producto_categoria: nuevoCategoria,
      });
      setProductos([...productos, nuevoProducto]);
      cerrarModalAgregar();
    } catch (error) {
      setErrorAgregar("No se pudo agregar el producto. Inténtalo de nuevo.");
      console.error(error);
    }
  };

  if (!visible) return null;

  return (
    <div className="listar-modal-fondo">
      <div className="listar-modal-contenido">
        <button className="listar-modal-cerrar" onClick={() => actualizaVisibilidad(false)}>✖️</button>
        <h2 className="title-listaproductos">Lista de Productos</h2>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button className="agregarbutton" onClick={abrirModalAgregar}>Agregar Producto</button>
          <button className="agregarbutton" onClick={() => setModalCategorias(true)}>Ver Categorías</button>
        </div>
        {errorGeneral && <p style={{ color: "red" }}>{errorGeneral}</p>}
        <table className="tabla-productos">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Proveedor</th>
              <th>Categoría</th>
              <th>Cantidad total</th>
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
                <td>{producto.producto_categoria}</td>
                <td>{producto.cantidad_total}</td>
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
              {errorAgregar && (
                  <div style={{ color: "red", marginBottom: 8 }}>{errorAgregar}</div>
                )}
              <form onSubmit={handleAgregarProducto}>
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
                  Descripción:
                  <input
                    type="text"
                    value={nuevaDescripcionAgregar}
                    onChange={(e) => {
                      setNuevaDescripcionAgregar(e.target.value);
                      setError("");
                    }}
                    required
                  />
                </label>
                <label>
                  Proveedor:
                  <select
                    value={nuevoProovedorAgregar}
                    onChange={(e) => {
                      setNuevoProovedorAgregar(e.target.value);
                      setError("");
                    }}
                    required
                  >
                    <option value="">Seleccione un proveedor</option>
                    {proveedores.map((prov) => (
                      <option key={prov.proveedor_id} value={prov.proveedor_id}>
                        {prov.proveedor_nombre}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Categoría:
                  <select
                    value={nuevoCategoria}
                    onChange={(e) => setNuevoCategoria(e.target.value)}
                    required
                  >
                    <option value="">Seleccione una categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat.categoria_id || cat} value={cat.categoria_nombre || cat}>
                        {cat.categoria_nombre || cat}
                      </option>
                    ))}
                  </select>
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
              {errorModificar && (
                  <div style={{ color: "red", marginBottom: 8 }}>{errorModificar}</div>
                )}
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
                  Descripción:
                  <input
                    type="text"
                    value={nuevaDescripcion}
                    onChange={(e) => {
                      setNuevaDescripcion(e.target.value);
                      setError("");
                    }}
                    required
                  />
                </label>
                <label>
                  Proveedor:
                  <select
                    value={nuevoProovedor}
                    onChange={(e) => {
                      setNuevoProovedor(e.target.value);
                      setError("");
                    }}
                    required
                  >
                    <option value="">Seleccione un proveedor</option>
                    {proveedores.map((prov) => (
                      <option key={prov.proveedor_id} value={prov.proveedor_id}>
                        {prov.proveedor_nombre}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Categoría:
                  <select
                    value={nuevoCategoria}
                    onChange={(e) => setNuevoCategoria(e.target.value)}
                    required
                  >
                    <option value="">Seleccione una categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat.categoria_id || cat} value={cat.categoria_nombre || cat}>
                        {cat.categoria_nombre || cat}
                      </option>
                    ))}
                  </select>
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

        <ListarCategorias
          visible={modalCategorias}
          onClose={() => setModalCategorias(false)}
        />
      </div>
    </div>
  );
}

export default ListarProductos;
