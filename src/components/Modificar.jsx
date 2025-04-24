import React from "react";
import { modificarUsuario } from "../services/consultas";

function Modificar({ visible, actualizaVisibilidad }) {
  const [id, setId] = React.useState("");
  const [nombre, setNombre] = React.useState("");
  const [contrasena, setContrasena] = React.useState("");
  const [cargo, setCargo] = React.useState("");
  const [error, setError] = React.useState("");

  const handleModificarUsuario = async (event) => {
    event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
    setError(""); // Limpiar errores previos

    // Validar que el ID sea obligatorio
    if (!id) {
      setError("El ID del usuario es obligatorio.");
      return;
    }

    // Construir el objeto con los datos opcionales
    const usuario = {};
    usuario.id = parseInt(id, 10); // Convertir ID a número
    if (nombre) usuario.nombre = nombre; // Solo incluir si tiene valor
    if (contrasena) usuario.contrasena = contrasena; // Solo incluir si tiene valor
    if (cargo) usuario.cargo = parseInt(cargo, 10); // Convertir cargo a número si tiene valor

    // Validar que al menos un campo opcional tenga valor
    if (!usuario.nombre && !usuario.contrasena && !usuario.cargo) {
      setError("Debes proporcionar al menos un campo para actualizar.");
      return;
    }

    try {
      const resultado = await modificarUsuario(usuario);
      console.log("Usuario modificado:", resultado);
      actualizaVisibilidad(false); // Ocultar el componente después de modificar
    } catch (error) {
      console.error("Error al modificar el usuario:", error);
      setError("No se pudo modificar el usuario. Inténtalo de nuevo.");
    }
  };

  if (!visible) return null; // No renderiza nada si el componente no es visible

  return (
    <div className="modificar">
      <h2>Modificar Usuario</h2>
      <form onSubmit={handleModificarUsuario}>
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="ID del usuario"
        />
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del usuario"
        />
        <input
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          placeholder="Nueva contraseña del usuario"
        />
        <input
          type="text"
          value={cargo}
          onChange={(e) => setCargo(e.target.value)}
          placeholder="Cargo del usuario"
        />
        <button type="submit">Modificar</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Modificar;