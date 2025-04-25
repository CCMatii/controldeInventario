import { useContext, useState } from 'react';
import { ContextoAutenticacion } from './context/auntenticarContext';
import Login from './components/Login';
import Borrar from './components/borrar';
import Agregar from './components/Agregar';
import Modificar from './components/Modificar';
import Listar from './components/Listar';

const InventarioApp = () => {
  const { estaAutenticado } = useContext(ContextoAutenticacion);
  const [borrarvisible, setBorrarVisible] = useState(false);
  const [agregarVisible, setAgregarVisible] = useState(false);
  const [modificarVisible, setModificarVisible] = useState(false);
  const [listarVisible, setListarVisible] = useState(false);

  const toggleVisibilidad = (componente) => {
    if (componente === 'borrar') setBorrarVisible(!borrarvisible);
    if (componente === 'agregar') setAgregarVisible(!agregarVisible);
    if (componente === 'modificar') setModificarVisible(!modificarVisible);
    if (componente === 'listar') setListarVisible(!listarVisible);
  };
  
  return (
    <div className="inventario-app">
      {estaAutenticado ? (
        <div className="contenido-inventario">
          <button onClick={() => toggleVisibilidad('borrar')}>Borrar Usuario</button>
          <button onClick={() => toggleVisibilidad('agregar')}>Agregar Usuario</button>
          <button onClick={() => toggleVisibilidad('modificar')}>Modificar Usuario</button>
          <button onClick={() => toggleVisibilidad('listar')}>Listar Usuarios</button>
        </div>
      ) : (
        <Login visible={true} actualizaVisibilidad={() => {}} />
      )}
      <Borrar visible={borrarvisible} actualizaVisibilidad={setBorrarVisible} />   
      <Agregar visible={agregarVisible} actualizaVisibilidad={setAgregarVisible} />
      <Modificar visible={modificarVisible} actualizaVisibilidad={setModificarVisible} />
      <Listar visible={listarVisible} actualizaVisibilidad={setListarVisible} />
    </div>
     

  );
};

export default InventarioApp;