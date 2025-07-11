import React from "react";
import {
  listarProveedores,
  eliminarProveedor,
  modificarProveedor,
  agregarProveedor,
} from "../services/consultas";
import "./List_provee.css"; // Asegúrate de que esta línea esté presente

function ListProvee({ visible, actualizaVisibilidad }) {
  const [proveedores, setProveedores] = React.useState([]);
  const [error, setError] = React.useState("");
  const [modalAbierto, setModalAbierto] = React.useState(false);
  const [proveedorEdit, setProveedorEdit] = React.useState(null);
  const [nuevoNombre, setNuevoNombre] = React.useState("");
  const [nuevoVendedor, setNuevoVendedor] = React.useState("");
  const [nuevoContacto, setNuevoContacto] = React.useState("");
  const [nuevaDireccion, setNuevaDireccion] = React.useState("");
  const [nuevaComuna, setNuevaComuna] = React.useState("");
  const [nuevoGiro, setNuevoGiro] = React.useState("");
  const [modalAgregar, setModalAgregar] = React.useState(false);
  const [nuevoNombreAgregar, setNuevoNombreAgregar] = React.useState("");
  const [nuevoVendedorAgregar, setNuevoVendedorAgregar] = React.useState("");
  const [nuevoContactoAgregar, setNuevoContactoAgregar] = React.useState("");
  const [nuevaDireccionAgregar, setNuevaDireccionAgregar] = React.useState("");
  const [nuevaComunaAgregar, setNuevaComunaAgregar] = React.useState("");
  const [nuevoGiroAgregar, setNuevoGiroAgregar] = React.useState("");

  // Restricciones
  const campoValido = (valor) => {
    const val = valor.trim();
    return (
      val.length >= 3 &&
      /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ]/.test(val) &&
      /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ .,'-]+$/.test(val)
    );
  };
  // Permitir "+" en contacto
  const contactoValido = (valor) => {
    const val = valor.trim();
    return (
      val.length >= 3 &&
      /^[A-Za-z0-9+]/.test(val) &&
      /^[A-Za-z0-9 +.,'-]+$/.test(val)
    );
  };

  const handleListarProveedores = async () => {
    try {
      const resultado = await listarProveedores();
      setProveedores(resultado);
    } catch (error) {
      setError("No se pudo listar los proveedores. Inténtalo de nuevo.");
    }
  };

  const handleEliminarProveedor = async (proveedorId) => {
    if (!window.confirm("¿Seguro que deseas eliminar este proveedor?")) return;
    try {
      await eliminarProveedor(proveedorId);
      setProveedores(proveedores.filter((p) => p.proveedor_id !== proveedorId));
    } catch (error) {
      setError("No se pudo eliminar el proveedor. Inténtalo de nuevo.");
    }
  };

  const abrirModal = (proveedor) => {
    setProveedorEdit(proveedor);
    setNuevoNombre(proveedor.proveedor_nombre);
    setNuevoVendedor(proveedor.proveedor_vendedor);
    setNuevoContacto(proveedor.proveedor_contacto);
    setNuevaDireccion(proveedor.proveedor_direccion);
    setNuevaComuna(proveedor.proveedor_comuna);
    setNuevoGiro(proveedor.proveedor_giro);
    setError("");
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setProveedorEdit(null);
    setNuevoNombre("");
    setNuevoVendedor("");
    setNuevoContacto("");
    setNuevaDireccion("");
    setNuevaComuna("");
    setNuevoGiro("");
    setError("");
  };

  const handleGuardar = async (e) => {
  e.preventDefault();

  if (!proveedorEdit) {
    setError("Error interno: proveedor no seleccionado");
    return;
  }

  if (
    !campoValido(nuevoNombre) ||
    !campoValido(nuevoVendedor) ||
    !contactoValido(nuevoContacto) ||
    !campoValido(nuevaDireccion) ||
    !campoValido(nuevaComuna) ||
    !campoValido(nuevoGiro)
  ) {
    setError(
      "Todos los campos deben tener al menos 3 caracteres, no comenzar con espacio o carácter especial, y solo contener letras, números y espacios. El contacto puede incluir '+'.",
    );
    return;
  }

  const datosModificar = {
    id: proveedorEdit.proveedor_id,
    nombre: nuevoNombre.trim(),
    vendedor: nuevoVendedor.trim(),
    contacto: nuevoContacto.trim(),
    direccion: nuevaDireccion.trim(),
    comuna: nuevaComuna.trim(),
    giro: nuevoGiro.trim(),
  };

  console.log("Datos a modificar:", datosModificar);

  try {
    await modificarProveedor(datosModificar);

    setProveedores(
      proveedores.map((p) =>
        p.proveedor_id === proveedorEdit.proveedor_id
          ? {
              ...p,
              proveedor_nombre: datosModificar.nombre,
              proveedor_vendedor: datosModificar.vendedor,
              proveedor_contacto: datosModificar.contacto,
              proveedor_direccion: datosModificar.direccion,
              proveedor_comuna: datosModificar.comuna,
              proveedor_giro: datosModificar.giro,
            }
          : p,
      ),
    );

    cerrarModal();
  } catch (error) {
    setError("No se pudo modificar el proveedor. Inténtalo de nuevo.");
  }
};

  const abrirModalAgregar = () => {
    setNuevoNombreAgregar("");
    setNuevoVendedorAgregar("");
    setNuevoContactoAgregar("");
    setNuevaDireccionAgregar("");
    setNuevaComunaAgregar("");
    setNuevoGiroAgregar("");
    setError("");
    setModalAgregar(true);
  };

  const cerrarModalAgregar = () => {
    setModalAgregar(false);
    setNuevoNombreAgregar("");
    setNuevoVendedorAgregar("");
    setNuevoContactoAgregar("");
    setNuevaDireccionAgregar("");
    setNuevaComunaAgregar("");
    setNuevoGiroAgregar("");
    setError("");
  };

  const handleAgregarProveedor = async (e) => {
    e.preventDefault();
    if (
      !campoValido(nuevoNombreAgregar) ||
      !campoValido(nuevoVendedorAgregar) ||
      !contactoValido(nuevoContactoAgregar) ||
      !campoValido(nuevaDireccionAgregar) ||
      !campoValido(nuevaComunaAgregar) ||
      !campoValido(nuevoGiroAgregar)
    ) {
      setError(
        "Todos los campos deben tener al menos 3 caracteres, no comenzar con espacio o carácter especial, y solo contener letras, números y espacios. El contacto puede incluir '+'.",
      );
      return;
    }
    try {
      const nuevoProveedor = await agregarProveedor({
        nombre: nuevoNombreAgregar.trim(),
        vendedor: nuevoVendedorAgregar.trim(),
        contacto: nuevoContactoAgregar.trim(),
        direccion: nuevaDireccionAgregar.trim(),
        comuna: nuevaComunaAgregar.trim(),
        giro: nuevoGiroAgregar.trim(),
      });
      setProveedores([...proveedores, nuevoProveedor]);
      cerrarModalAgregar();
    } catch (error) {
      setError("No se pudo agregar el proveedor. Inténtalo de nuevo.");
    }
  };

  React.useEffect(() => {
    if (visible) {
      handleListarProveedores();
      setError("");
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="proveedor-modal-fondo">
      <div className="proveedor-modal-contenido">
        <button className="proveedor-modal-cerrar" onClick={() => actualizaVisibilidad(false)}>✖️</button>
        <h2 className="proveedor-title">Lista de Proveedores</h2>
        <button className="proveedor-agregar-button" onClick={abrirModalAgregar}>Agregar Proveedor</button>
        {error && <div className="proveedor-error-modal">{error}</div>}
        <table className="proveedor-tabla">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Vendedor</th>
              <th>Contacto</th>
              <th>Dirección</th>
              <th>Comuna</th>
              <th>Giro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map((proveedor) => (
              <tr key={proveedor.proveedor_id}>
                <td>{proveedor.proveedor_id}</td>
                <td>{proveedor.proveedor_nombre}</td>
                <td>{proveedor.proveedor_vendedor}</td>
                <td>{proveedor.proveedor_contacto}</td>
                <td>{proveedor.proveedor_direccion}</td>
                <td>{proveedor.proveedor_comuna}</td>
                <td>{proveedor.proveedor_giro}</td>
                <td>
                  <button
                    className="proveedor-boton-editar"
                    onClick={() => abrirModal(proveedor)}
                    title="Modificar"
                  >
                    ✏️
                  </button>
                  <button
                    className="proveedor-boton-eliminar"
                    onClick={() => handleEliminarProveedor(proveedor.proveedor_id)}
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
          <div className="proveedor-modal-agregar-fondo">
            <div className="proveedor-modal-contenido">
              <h3>Agregar Proveedor</h3>
              {error && <div className="proveedor-error-modal">{error}</div>}
              <form onSubmit={handleAgregarProveedor}>
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
                  Vendedor:
                  <input
                    type="text"
                    value={nuevoVendedorAgregar}
                    onChange={(e) => {
                      setNuevoVendedorAgregar(e.target.value);
                      setError("");
                    }}
                    required
                  />
                </label>
                <label>
                  Contacto:
                  <input
                    type="text"
                    value={nuevoContactoAgregar}
                    onChange={(e) => {
                      setNuevoContactoAgregar(e.target.value);
                      setError("");
                    }}
                    required
                  />
                </label>
                <label>
                  Dirección:
                  <input
                    type="text"
                    value={nuevaDireccionAgregar}
                    onChange={(e) => {
                      setNuevaDireccionAgregar(e.target.value);
                      setError("");
                    }}
                    required
                  />
                </label>
                <label>
                  Comuna:
                  <input
                    type="text"
                    value={nuevaComunaAgregar}
                    onChange={(e) => {
                      setNuevaComunaAgregar(e.target.value);
                      setError("");
                    }}
                    required
                  />
                </label>
                <label>
                  Giro:
                  <input
                    type="text"
                    value={nuevoGiroAgregar}
                    onChange={(e) => {
                      setNuevoGiroAgregar(e.target.value);
                      setError("");
                    }}
                    required
                  />
                </label>
                <div className="proveedor-modal-acciones">
                  <button type="submit" className="proveedor-modal-agregar-btn-guardar">Agregar</button>
                  <button type="button" className="proveedor-modal-agregar-btn-cancelar" onClick={cerrarModalAgregar}>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {modalAbierto && (
          <div className="proveedor-modal-fondo">
            <div className="proveedor-modal-contenido">
              <h3>Modificar Proveedor</h3>
              {error && <div className="proveedor-error-modal">{error}</div>}
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
                  Vendedor:
                  <input
                    type="text"
                    value={nuevoVendedor}
                    onChange={(e) => {
                      setNuevoVendedor(e.target.value);
                      setError("");
                    }}
                    required
                  />
                </label>
                <label>
                  Contacto:
                  <input
                    type="text"
                    value={nuevoContacto}
                    onChange={(e) => {
                      setNuevoContacto(e.target.value);
                      setError("");
                    }}
                    required
                  />
                </label>
                <label>
                  Dirección:
                  <input
                    type="text"
                    value={nuevaDireccion}
                    onChange={(e) => {
                      setNuevaDireccion(e.target.value);
                      setError("");
                    }}
                    required
                  />
                </label>
                <label>
                  Comuna:
                  <input
                    type="text"
                    value={nuevaComuna}
                    onChange={(e) => {
                      setNuevaComuna(e.target.value);
                      setError("");
                    }}
                    required
                  />
                </label>
                <label>
                  Giro:
                  <input
                    type="text"
                    value={nuevoGiro}
                    onChange={(e) => {
                      setNuevoGiro(e.target.value);
                      setError("");
                    }}
                    required
                  />
                </label>
                <div className="proveedor-modal-acciones">
                  {/* Usamos las clases de los botones de agregar para mantener la consistencia */}
                  <button type="submit" className="proveedor-modal-agregar-btn-guardar">Guardar</button>
                  <button type="button" className="proveedor-modal-agregar-btn-cancelar" onClick={cerrarModal}>
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

export default ListProvee;
