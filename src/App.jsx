import Login from './components/Login';
import { ProveedorAutenticacion } from './context/auntenticarContext';

function App() {
  return (
    <ProveedorAutenticacion>
      <Login />
    </ProveedorAutenticacion>
  );
}

export default App;