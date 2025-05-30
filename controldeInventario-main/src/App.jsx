import InventarioApp from './Inventario';
import { ProveedorAutenticacion } from './context/auntenticarContext';

function App() {
  return (
    <ProveedorAutenticacion>
      <InventarioApp />
    </ProveedorAutenticacion>
  );
}

export default App;