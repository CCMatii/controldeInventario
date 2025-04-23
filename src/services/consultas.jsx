
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