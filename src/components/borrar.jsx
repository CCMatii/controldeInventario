import React from "react";
import { eliminarUsuario } from "../services/consultas";

function Borrar({ visible, actualizaVisibilidad }) {
  const [id, setId] = React.useState("");
  const [error, setError] = React.useState("");

  const handleEliminarUsuario = async (event) => {
    event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
    setError(""); // Limpiar errores previos

    if (!id) {
      setError("Por favor, ingresa un ID válido.");
      return;
    }

    try {
      await eliminarUsuario(id);
      console.log("Usuario eliminado correctamente");
      actualizaVisibilidad(false); // Ocultar el componente después de eliminar
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      setError("No se pudo eliminar el usuario. Inténtalo de nuevo.");
    }
  };

  if (!visible) return null; // No renderiza nada si el componente no es visible

  return (
    <div className="borrar">
      <h2>Borrar Usuario</h2>
      <form onSubmit={handleEliminarUsuario}>
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="ID del usuario"
        />
        <button type="submit">Borrar</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Borrar;
