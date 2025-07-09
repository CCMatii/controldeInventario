import { useContext, useState } from 'react';
import { ContextoAutenticacion } from './context/auntenticarContext';
import Login from './components/Login';
import Listar from './components/Listar';
import ListProvee from './components/List_provee';
import ListaInventario from './components/ListaInventario';
import ListarProductos from './components/ListarProductos';
import ListMovimientos from './components/ListaMovimentos';
import ListaBodega from './components/ListaBodega';
import './Inventario.css';

const InventarioApp = () => {
  const { estaAutenticado, credenciales } = useContext(ContextoAutenticacion);
  const [listarVisible, setListarVisible] = useState(false);
  const [listarProveeVisible, setListarProveeVisible] = useState(false);
  const [productosVisible, setProductosVisible] = useState(false);
  const [movimientosVisible, setMovimientosVisible] = useState(false);
  const [bodegaVisible, setBodegaVisible] = useState(false);

  const toggleVisibilidad = (componente) => {
    if (componente === 'listar') setListarVisible(!listarVisible);
    if (componente === 'listarProvee') setListarProveeVisible(!listarProveeVisible);
    if (componente === 'productos') setProductosVisible(!productosVisible);
    if (componente === 'movimientos') setMovimientosVisible(!movimientosVisible);
    if (componente === 'bodega') setBodegaVisible(!bodegaVisible);
  };
  
  return (
    <div className="inventario-app">
      {estaAutenticado ? (
        <>
          <nav className="navbar-inventario">
            {credenciales.cargo_nombre === "Administrador" && (
              <>
                <span className="navbar-link" onClick={() => toggleVisibilidad('listar')}>Manejo de Usuarios</span>
                <span className="navbar-link" onClick={() => toggleVisibilidad('listarProvee')}>Manejo de Proveedores</span>
                <span className="navbar-link" onClick={() => toggleVisibilidad('bodega')}>Manejo de Bodegas</span>
              </>
            )}
            <span className="navbar-link" onClick={() => toggleVisibilidad('productos')}>Manejo de Productos</span>
            <span className="navbar-link" onClick={() => toggleVisibilidad('movimientos')}>Movimientos Realizados</span>
          </nav>
          <div className="contenido-inventario">
            <div className='inventario-lista'>
              <ListaInventario visible={true} />
            </div>
          </div>
        </>
      ) : (
        <Login visible={true} actualizaVisibilidad={() => {}} />
      )}
      <Listar visible={listarVisible} actualizaVisibilidad={setListarVisible} />
      <ListProvee visible={listarProveeVisible} actualizaVisibilidad={setListarProveeVisible} />
      <ListMovimientos visible={movimientosVisible} actualizaVisibilidad={setMovimientosVisible} />
      <ListarProductos visible={productosVisible} actualizaVisibilidad={setProductosVisible} />
      <ListaBodega visible={bodegaVisible} actualizaVisibilidad={setBodegaVisible} />
    </div>
  );
};

export default InventarioApp;