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
  
  return (
    <div className="inventario-app">
      {estaAutenticado ? (
        <div className="contenido-inventario">
          <button onClick={()=>setBorrarVisible(true)}>Borrar Usuario</button>
          <button onClick={()=>setAgregarVisible(true)}>Agregar Usuario</button>
          <button onClick={()=>setModificarVisible(true)}>Modificar Usuario</button>
          <button onClick={()=>setListarVisible(true)}>Listar Usuarios</button>
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