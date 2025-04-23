import './Login.css';
import rombo from '../assets/rombo.png';
import { useState, useContext } from 'react';
import { ContextoAutenticacion } from '../context/auntenticarContext';

function Login() {
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const { autenticarUsuario } = useContext(ContextoAutenticacion);

  const manejarSubmit = async (e) => {
    e.preventDefault();
    const exito = await autenticarUsuario(usuario, contraseña);
    if (!exito) {
      setError('Usuario o contraseña incorrectos');
    } else {
      setError('Usuario autenticado con éxito');
    }
  };

  return (
    <form className="login-container" onSubmit={manejarSubmit}>
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
  );
}

export default Login;