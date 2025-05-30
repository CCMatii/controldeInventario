import React from "react";
import CryptoJS from "crypto-js"; // Asegúrate de que esta librería esté instalada
import { agregarUsuario } from "../services/consultas";

function Agregar({ visible, actualizaVisibilidad }) {
  const [id, setId] = React.useState("");
  const [nombre, setNombre] = React.useState("");
  const [contrasena, setContrasena] = React.useState("");
  const [cargo, setCargo] = React.useState("");
  const [error, setError] = React.useState("");

  const handleAgregarUsuario = async (event) => {
    event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
    setError(""); // Limpiar errores previos

    // Validar que todos los campos estén completos
    if (!id || !nombre || !contrasena || !cargo) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    // Validar que ID y Cargo sean números
    const idNumerico = parseInt(id, 10);
    const cargoNumerico = parseInt(cargo, 10);
    if (isNaN(idNumerico) || isNaN(cargoNumerico)) {
      setError("El ID y el Cargo deben ser números válidos.");
      return;
    }

    // Hashear la contraseña antes de enviarla
    const contrasenaHasheada = CryptoJS.SHA256(contrasena).toString();

    const nuevoUsuario = {
      id: idNumerico, // Convertido a número
      nombre,
      cargo: cargoNumerico, // Convertido a número
      contrasena: contrasenaHasheada, // Contraseña hasheada
    };

    try {
      const resultado = await agregarUsuario(nuevoUsuario);
      console.log("Usuario agregado correctamente:", resultado);
      actualizaVisibilidad(false); // Ocultar el componente después de agregar
    } catch (error) {
      console.error("Error al agregar el usuario:", error);
      setError("No se pudo agregar el usuario. Inténtalo de nuevo.");
    }
  };

  if (!visible) return null; // No renderiza nada si el componente no es visible

  return (
    <div className="agregar">
      <h2>Agregar Usuario</h2>
      <form onSubmit={handleAgregarUsuario}>
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
          placeholder="Contraseña del usuario"
        />
        <input
          type="text"
          value={cargo}
          onChange={(e) => setCargo(e.target.value)}
          placeholder="Cargo del usuario"
        />
        <button type="submit">Agregar</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Agregar;
