import { useContext, useState } from 'react';
import { ContextoAutenticacion } from './context/auntenticarContext';
import Login from './components/Login';
import Listar from './components/Listar';
import Productos from './components/Productos';

const InventarioApp = () => {
  const { estaAutenticado, credenciales } = useContext(ContextoAutenticacion);
  const [listarVisible, setListarVisible] = useState(false);

  const toggleVisibilidad = (componente) => {
    if (componente === 'agregar') setAgregarVisible(!agregarVisible);
    if (componente === 'listar') setListarVisible(!listarVisible);
  };
  
  return (
    <div className="inventario-app">
      {estaAutenticado ? (
        <div className="contenido-inventario">
          {credenciales.cargo_nombre === "Administrador" && (
            <>
              <button onClick={() => toggleVisibilidad('listar')}>Listar Usuarios</button>
            </>
          )}
          <Productos visible={true}/>
        </div>
      ) : (
        <Login visible={true} actualizaVisibilidad={() => {}} />
      )} 
      <Listar visible={listarVisible} actualizaVisibilidad={setListarVisible} />
    </div>
  );
};

export default InventarioApp;