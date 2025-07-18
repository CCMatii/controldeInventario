import './Login.css';
import rombo from '../assets/rombo.png';
import { useState, useContext } from 'react';
import { ContextoAutenticacion } from '../context/auntenticarContext';
import CryptoJS from 'crypto-js'; // Importar la librería para hashear

function Login({ visible, actualizaVisibilidad }) {

  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const { autenticarUsuario } = useContext(ContextoAutenticacion);

  const manejarSubmit = async (e) => {
    e.preventDefault();
    const contraseñaHasheada = CryptoJS.SHA256(contraseña).toString();
    const exito = await autenticarUsuario(usuario, contraseñaHasheada);
    if (!exito) {
      setError('Usuario o contraseña incorrectos');
    } else {
      setError('');
      actualizaVisibilidad(false); // Cierra el login si la autenticación es exitosa
    }
  };

  if (!visible) return null; // No renderiza nada si el componente no es visible

  return (
    <div className="login-container">
      <form onSubmit={manejarSubmit}>
        <img src={rombo} alt="Logo" />
        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
        />
        <button type="submit">Entrar</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default Login;