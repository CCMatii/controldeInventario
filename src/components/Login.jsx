import './Login.css';
import rombo from '../assets/rombo.png';

function Login() {
    return (
      <div className="login-container">
        <img src={rombo} alt="Logo" />
        <input type="text" placeholder="Usuario" />
        <input type="password" placeholder="Contraseña" />
        <button>Entrar</button>
      </div>
    );
  }
  
  export default Login;