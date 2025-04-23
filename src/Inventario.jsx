import { useContext } from 'react';
import { ContextoAutenticacion } from './context/auntenticarContext';
import Login from './components/Login';

const InventarioApp = () => {
  const { estaAutenticado } = useContext(ContextoAutenticacion);

  return (
    <div className="inventario-app">
      {estaAutenticado ? (
        <h1>Bienvenido al sistema de inventario</h1>
      ) : (
        <Login visible={true} actualizaVisibilidad={() => {}} />
      )}
    </div>
  );
};

export default InventarioApp;