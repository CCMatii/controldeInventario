import { useContext, useState } from 'react';
import { ContextoAutenticacion } from './context/auntenticarContext';
import Login from './components/Login';
import Agregar from './components/Agregar';
import Listar from './components/Listar';

const InventarioApp = () => {
  const { estaAutenticado } = useContext(ContextoAutenticacion);
  const [agregarVisible, setAgregarVisible] = useState(false);
  const [listarVisible, setListarVisible] = useState(false);

  const toggleVisibilidad = (componente) => {
    if (componente === 'agregar') setAgregarVisible(!agregarVisible);
    if (componente === 'listar') setListarVisible(!listarVisible);
  };
  
  return (
    <div className="inventario-app">
      {estaAutenticado ? (
        <div className="contenido-inventario">
          <button onClick={() => toggleVisibilidad('agregar')}>Agregar Usuario</button>
          <button onClick={() => toggleVisibilidad('listar')}>Listar Usuarios</button>
        </div>
      ) : (
        <Login visible={true} actualizaVisibilidad={() => {}} />
      )}   
      <Agregar visible={agregarVisible} actualizaVisibilidad={setAgregarVisible} />
      <Listar visible={listarVisible} actualizaVisibilidad={setListarVisible} />
    </div>
     

  );
};

export default InventarioApp;