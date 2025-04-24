
const urlBase = "https://inventario-api-mu.vercel.app/";

export const autenticar = async (usuario, contrasena) => {
  const url = `${urlBase}token`;

  const body = new URLSearchParams({
    grant_type: "password",
    username: usuario,
    password: contrasena
  });

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json"
    },
    body: body.toString()
  };

  try {
    const response = await fetch(url, options);
    const text = await response.text();

    if (!response.ok) {
      console.error("Respuesta del servidor:", text);
      throw new Error("Error en la autenticación");
    }

    const result = JSON.parse(text); // { access_token, token_type }
    return result;
  } catch (error) {
    console.error("Error capturado:", error);
    throw error;
  }
};

export const eliminarUsuario = async (usuarioId) => {
  const url = `${urlBase}usuarios/delete/${usuarioId}`;

  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error al eliminar usuario:", errorText);
      throw new Error("No se pudo eliminar el usuario");
    }

    console.log(`Usuario con ID ${usuarioId} eliminado exitosamente`);
    return { success: true };
  } catch (error) {
    console.error("Error capturado al eliminar usuario:", error);
    throw error;
  }
};

export const agregarUsuario = async (usuario) => {
  const url = `${urlBase}usuarios/add?usuario_id=${usuario.id}&usuario_nombre=${usuario.nombre}&cargo_id=${usuario.cargo}&usuario_password=${usuario.contrasena}`;

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json"
    }
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error al agregar usuario:", errorText);
      throw new Error("No se pudo agregar el usuario");
    }

    const result = await response.json();
    console.log("Usuario agregado exitosamente:", result);
    return result;
  } catch (error) {
    console.error("Error capturado al agregar usuario:", error);
    throw error;
  }
};

export const modificarUsuario = async (usuario) => {
  const url = `${urlBase}usuarios/update/${usuario.id}`;

  // Construir el cuerpo de la solicitud con los campos opcionales
  const usuarioData = {};
  if (usuario.nombre) usuarioData.usuario_nombre = usuario.nombre;
  if (usuario.contrasena) usuarioData.usuario_password = usuario.contrasena;
  if (usuario.cargo) usuarioData.cargo_id = usuario.cargo;

  // Verificar si hay datos para actualizar
  if (Object.keys(usuarioData).length === 0) {
    throw new Error("No se proporcionaron datos para actualizar");
  }

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(usuarioData)
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error al modificar usuario:", errorText);
      throw new Error("No se pudo modificar el usuario");
    }

    const result = await response.json();
    console.log("Usuario modificado exitosamente:", result);
    return result;
  } catch (error) {
    console.error("Error capturado al modificar usuario:", error);
    throw error;
  }
};

export const listarUsuarios = async () => {
  const url = `${urlBase}usuarios`;

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error al listar usuarios:", errorText);
      throw new Error("No se pudo listar los usuarios");
    }

    const result = await response.json();
    console.log("Lista de usuarios:", result);
    return result;
  } catch (error) {
    console.error("Error capturado al listar usuarios:", error);
    throw error;
  }
};