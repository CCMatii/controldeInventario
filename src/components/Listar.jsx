import React from "react";
import { listarUsuarios, eliminarUsuario } from "../services/consultas";
import "./Listar.css"; // Asegúrate de tener un archivo CSS para estilos

function Listar({ visible, actualizaVisibilidad }) {
  const [usuarios, setUsuarios] = React.useState([]);
  const [error, setError] = React.useState("");

  const handleListarUsuarios = async () => {
    try {
      const resultado = await listarUsuarios();
      setUsuarios(resultado);
    } catch (error) {
      console.error("Error al listar los usuarios:", error);
      setError("No se pudo listar los usuarios. Inténtalo de nuevo.");
    }
  };

  const handleEliminarUsuario = async (usuarioId) => {
    try {
      await eliminarUsuario(usuarioId); // Llama a la consulta para eliminar
      setUsuarios(usuarios.filter((usuario) => usuario.usuario_id !== usuarioId)); // Actualiza la lista local
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      setError("No se pudo eliminar el usuario. Inténtalo de nuevo.");
    }
  };

  React.useEffect(() => {
    if (visible) {
      handleListarUsuarios();
    }
  }, [visible]);

  if (!visible) return null; // No renderiza nada si el componente no es visible

  return (
    <div className="listar">
      <h2>Lista de Usuarios</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table className="tabla-usuarios">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Cargo</th>
            <th>Borrar</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.usuario_id}>
              <td>{usuario.usuario_id}</td>
              <td>{usuario.usuario_nombre}</td>
              <td>{usuario.cargo_nombre}</td>
              <td><button className="botonEditar" onClick={() => handleEliminarUsuario(usuario.usuario_id)}>✖️</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Listar;