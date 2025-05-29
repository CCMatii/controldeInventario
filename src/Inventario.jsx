import { useContext, useState } from 'react';
import { ContextoAutenticacion } from './context/auntenticarContext';
import Login from './components/Login';
import Listar from './components/Listar';
import Productos from './components/Productos';
import ListProvee from './components/List_provee';

const InventarioApp = () => {
  const { estaAutenticado, credenciales } = useContext(ContextoAutenticacion);
  const [listarVisible, setListarVisible] = useState(false);
  const [listarProveeVisible, setListarProveeVisible] = useState(false);

  const toggleVisibilidad = (componente) => {
    if (componente === 'listar') setListarVisible(!listarVisible);
    if (componente === 'listarProvee') setListarProveeVisible(!listarProveeVisible);
  };
  
  return (
    <div className="inventario-app">
      {estaAutenticado ? (
        <div className="contenido-inventario">
          {credenciales.cargo_nombre === "Administrador" && (
            <>
              <button onClick={() => toggleVisibilidad('listar')}>Listar Usuarios</button>
              <button onClick={() => toggleVisibilidad('listarProvee')}>Listar Proveedores</button>
            </>
          )}
          <Productos visible={true}/>
        </div>
      ) : (
        <Login visible={true} actualizaVisibilidad={() => {}} />
      )} 
      <Listar visible={listarVisible} actualizaVisibilidad={setListarVisible} />
      <ListProvee visible={listarProveeVisible} actualizaVisibilidad={setListarProveeVisible} />
    </div>
  );
};

export default InventarioApp;