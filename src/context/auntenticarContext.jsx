import { createContext, useState } from "react";
import { autenticar } from "../services/consultas";

export const ContextoAutenticacion = createContext();

export const ProveedorAutenticacion = ({ children }) => {
  const [credenciales, actualizaCredenciales] = useState({});
  const [estaAutenticado, actualizaEstaAutenticado] = useState(false);

  const autenticarUsuario = async (usuario, contraseña) => {
    try {
      const creds = await autenticar(usuario, contraseña);
      actualizaCredenciales(creds);
      actualizaEstaAutenticado(true);
      return true; // Retorna true si la autenticación es exitosa
    } catch (error) {
      console.error("Error autenticando:", error);
      actualizaEstaAutenticado(false);
      return false; // Retorna false si ocurre un error
    }
  };

  return (
    <ContextoAutenticacion.Provider
      value={{
        credenciales,
        estaAutenticado,
        autenticarUsuario,
      }}
    >
      {children}
    </ContextoAutenticacion.Provider>
  );
};