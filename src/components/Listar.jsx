import React from "react";
import { listarUsuarios } from "../services/consultas";

function Listar({ visible, actualizaVisibilidad }) {    
    const [usuarios, setUsuarios] = React.useState([]);
    const [error, setError] = React.useState("");
    
    const handleListarUsuarios = async () => {
        try {
        const resultado = await listarUsuarios();
        setUsuarios(resultado);
        } catch (error) {
        console.error("Error al listar los usuarios:", error);
        setError("No se pudo listar los usuarios. Inténtalo de nuevo.");
        }
    };
    
    React.useEffect(() => {
        if (visible) {
        handleListarUsuarios();
        }
    }, [visible]);
    
    if (!visible) return null; // No renderiza nada si el componente no es visible
    
    return (
        <div className="listar">
        <h2>Lista de Usuarios</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <ul>
            {usuarios.map((usuario) => (
            <li key={usuario.usuario_id}>
                {usuario.usuario_nombre} - {usuario.usuario_cargo}
            </li>
            ))}
        </ul>
        </div>
    );
    }

export default Listar;