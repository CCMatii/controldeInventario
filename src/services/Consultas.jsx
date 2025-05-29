const urlBase = "https://inventario-api-mu.vercel.app/";

export const autenticar = async (usuario, contrasena) => {
  const url = `${urlBase}token`;

  const body = new URLSearchParams({
    grant_type: "password",
    username: usuario,
    password: contrasena
  });

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json"
    },
    body: body.toString()
  };

  try {
    const response = await fetch(url, options);
    const text = await response.text();

    if (!response.ok) {
      console.error("Respuesta del servidor:", text);
      throw new Error("Error en la autenticación");
    }

    const result = JSON.parse(text); 
    return result;
  } catch (error) {
    console.error("Error capturado:", error);
    throw error;
  }
};

export const obtenerUsuarioActual = async () => {
  const url = `${urlBase}usuarios/me`;

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Token de autenticación
    },
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error al obtener el usuario actual:", errorText);
      throw new Error("No se pudo obtener el usuario actual");
    }

    const usuario = await response.json();
    return usuario;
  } catch (error) {
    console.error("Error capturado al obtener el usuario actual:", error);
    throw error;
  }
};

export const eliminarUsuario = async (usuarioId) => {
  const url = `${urlBase}usuarios/delete/${usuarioId}`;

  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error al eliminar usuario:", errorText);
      throw new Error("No se pudo eliminar el usuario");
    }

    console.log(`Usuario con ID ${usuarioId} eliminado exitosamente`);
    return { success: true };
  } catch (error) {
    console.error("Error capturado al eliminar usuario:", error);
    throw error;
  }
};

export const agregarUsuario = async (usuario) => {
  const url = `${urlBase}usuarios/add?usuario_id=${usuario.id}&usuario_nombre=${usuario.nombre}&cargo_nombre=${usuario.cargo_nombre}&usuario_password=${usuario.contrasena}`;

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json"
    }
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error al agregar usuario:", errorText);
      throw new Error("No se pudo agregar el usuario");
    }

    const result = await response.json();
    console.log("Usuario agregado exitosamente:", result);
    return result;
  } catch (error) {
    console.error("Error capturado al agregar usuario:", error);
    throw error;
  }
};

export const modificarUsuario = async (usuario) => {
  const url = `${urlBase}usuarios/update/${usuario.id}`;

  // Construir el objeto con los datos a modificar
  const usuarioData = {};
  if (usuario.nombre) usuarioData.usuario_nombre = usuario.nombre; // Nombre del usuario
  if (usuario.contrasena) usuarioData.usuario_password = usuario.contrasena; // Contraseña hasheada
  if (usuario.cargo_nombre) usuarioData.cargo_nombre = usuario.cargo_nombre; // Cargo como texto (VARCHAR)

  // Validar que haya al menos un campo para actualizar
  if (Object.keys(usuarioData).length === 0) {
    throw new Error("No se proporcionaron datos para actualizar");
  }

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(usuarioData), // Convertir los datos a JSON
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error al modificar usuario:", errorText);
      throw new Error("No se pudo modificar el usuario");
    }

    const result = await response.json();
    console.log("Usuario modificado exitosamente:", result);
    return result;
  } catch (error) {
    console.error("Error capturado al modificar usuario:", error);
    throw error;
  }
};

export const listarUsuarios = async () => {
  const url = `${urlBase}usuarios`;

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error al listar usuarios:", errorText);
      throw new Error("No se pudo listar los usuarios");
    }

    const result = await response.json();
    console.log("Lista de usuarios:", result);
    return result;
  } catch (error) {
    console.error("Error capturado al listar usuarios:", error);
    throw error;
  }
};

export const listarProductos = async () => {
  const url = `${urlBase}productos`;

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error al listar productos:", errorText);
      throw new Error("No se pudo listar los productos");
    }

    const result = await response.json();
    console.log("Lista de productos:", result);
    return result;
  } catch (error) {
    console.error("Error capturado al listar productos:", error);
    throw error;
  }
};

export const modificarProducto = async (producto) => {
  const url = `${urlBase}productos/update/${producto.id}`;

  const productoData = {};
  if (producto.nombre) productoData.producto_nombre = producto.nombre; // Nombre del producto
  if (producto.descripcion) productoData.producto_descripcion = producto.descripcion; // Descripción del producto
  if (producto.proveedor) productoData.producto_proovedor = producto.proveedor; // Proveedor del producto

  // Validar que haya al menos un campo para actualizar
  if (Object.keys(productoData).length === 0) {
    throw new Error("No se proporcionaron datos para actualizar");
  }

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(productoData), // Convertir los datos a JSON
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error al modificar producto:", errorText);
      throw new Error("No se pudo modificar el producto");
    }

    const result = await response.json();
    console.log("Producto modificado exitosamente:", result);
    return result;
  } catch (error) {
    console.error("Error capturado al modificar producto:", error);
    throw error;
  }
}

export const eliminarProducto = async (productoId) => {
  const url = `${urlBase}productos/delete/${productoId}`;

  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error al eliminar producto:", errorText);
      throw new Error("No se pudo eliminar el producto");
    }

    console.log(`Producto con ID ${productoId} eliminado exitosamente`);
    return { success: true };
  } catch (error) {
    console.error("Error capturado al eliminar producto:", error);
    throw error;
  }
}

export const agregarProducto = async (producto) => {
  const url = `${urlBase}productos/add?producto_id=${producto.producto_id}&producto_nombre=${encodeURIComponent(producto.producto_nombre)}&producto_descripcion=${encodeURIComponent(producto.producto_descripcion)}&producto_proovedor=${producto.producto_proovedor}`;

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error al agregar producto:", errorText);
      throw new Error("No se pudo agregar el producto");
    }

    const result = await response.json();
    console.log("Producto agregado exitosamente:", result);
    return result;
  } catch (error) {
    console.error("Error capturado al agregar producto:", error);
    throw error;
  }
};

//listarProveedores
export const listarProveedores = async () => {
  const url = `${urlBase}proveedores`;

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error al listar proveedores:", errorText);
      throw new Error("No se pudo listar los proveedores");
    }

    const result = await response.json();
    console.log("Lista de proveedores:", result);
    return result;
  } catch (error) {
    console.error("Error capturado al listar proveedores:", error);
    throw error;
  }
};

//agregarProveedor
export const agregarProveedor = async (proveedor) => {
  const url = `${urlBase}proveedores/add?proveedor_id=${proveedor.id}&proveedor_nombre=${encodeURIComponent(proveedor.nombre)}&proveedor_vendedor=${encodeURIComponent(proveedor.vendedor)}&proveedor_contacto=${encodeURIComponent(proveedor.contacto)}&proveedor_direccion=${encodeURIComponent(proveedor.direccion)}&proveedor_comuna=${encodeURIComponent(proveedor.comuna)}&proveedor_giro=${encodeURIComponent(proveedor.giro)}`;

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json"
    }
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error al agregar proveedor:", errorText);
      throw new Error("No se pudo agregar el proveedor");
    }

    const result = await response.json();
    console.log("Proveedor agregado exitosamente:", result);
    return result;
  } catch (error) {
    console.error("Error capturado al agregar proveedor:", error);
    throw error;
  }
};

//modificarProveedor
export const modificarProveedor = async (proveedor) => {
  const url = `${urlBase}proveedores/update/${proveedor.id}`;

  const proveedorData = {};
  if (proveedor.nombre) proveedorData.proveedor_nombre = proveedor.nombre; // Nombre del proveedor
  if (proveedor.vendedor) proveedorData.proveedor_vendedor = proveedor.vendedor; // Vendedor del proveedor
  if (proveedor.contacto) proveedorData.proveedor_contacto = proveedor.contacto; // Contacto del proveedor
  if (proveedor.direccion) proveedorData.proveedor_direccion = proveedor.direccion; // Dirección del proveedor
  if (proveedor.comuna) proveedorData.proveedor_comuna = proveedor.comuna; // Comuna del proveedor
  if (proveedor.giro) proveedorData.proveedor_giro = proveedor.giro; // Giro del proveedor

  // Validar que haya al menos un campo para actualizar
  if (Object.keys(proveedorData).length === 0) {
    throw new Error("No se proporcionaron datos para actualizar");
  }

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(proveedorData), // Convertir los datos a JSON
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error al modificar proveedor:", errorText);
      throw new Error("No se pudo modificar el proveedor");
    }

    const result = await response.json();
    console.log("Proveedor modificado exitosamente:", result);
    return result;
  } catch (error) {
    console.error("Error capturado al modificar proveedor:", error);
    throw error;
  }
}

// eliminarProveedor
export const eliminarProveedor = async (proveedorId) => {
  const url = `${urlBase}proveedores/delete/${proveedorId}`;

  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error al eliminar proveedor:", errorText);
      throw new Error("No se pudo eliminar el proveedor");
    }

    console.log(`Proveedor con ID ${proveedorId} eliminado exitosamente`);
    return { success: true };
  } catch (error) {
    console.error("Error capturado al eliminar proveedor:", error);
    throw error;
  }
}

export const listarCargos = async () => {
  const url = `${urlBase}cargos`;

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error al listar cargos:", errorText);
      throw new Error("No se pudo listar los cargos");
    }

    const result = await response.json();
    console.log("Lista de cargos:", result);
    return result;
  } catch (error) {
    console.error("Error capturado al listar cargos:", error);
    throw error;
  }
}

export const listarInventario = async () => {
  const url = `${urlBase}inventario`;

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error al listar inventario:", errorText);
      throw new Error("No se pudo listar el inventario");
    }

    const result = await response.json();
    console.log("Lista de inventario:", result);
    return result;
  } catch (error) {
    console.error("Error capturado al listar inventario:", error);
    throw error;
  }
}

export const agregarInventario = async (inventario) => {
  const url = `${urlBase}inventario/add?producto_id=${inventario.producto_id}&producto_nombre=${encodeURIComponent(
    inventario.producto_nombre
  )}&bodega_id=${inventario.bodega_id}&inventario_cantidad=${inventario.inventario_cantidad}`;

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error al agregar inventario:", errorText);
      throw new Error("No se pudo agregar el inventario");
    }

    const result = await response.json();
    console.log("Inventario agregado exitosamente:", result);
    return result;
  } catch (error) {
    console.error("Error capturado al agregar inventario:", error);
    throw error;
  }
};

export const modificarInventario = async (inventario) => {
  const url = `${urlBase}inventario/update/${inventario.inventario_id}`;

  // Construir el objeto con los datos a modificar
  const inventarioData = {};
  if (inventario.producto_nombre) inventarioData.producto_nombre = inventario.producto_nombre;
  if (inventario.bodega_id) inventarioData.bodega_id = inventario.bodega_id;
  if (inventario.inventario_cantidad) inventarioData.inventario_cantidad = inventario.inventario_cantidad;

  // Validar que haya al menos un campo para actualizar
  if (Object.keys(inventarioData).length === 0) {
    throw new Error("No se proporcionaron datos para actualizar");
  }

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(inventarioData), // Convertir los datos a JSON
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error al modificar inventario:", errorText);
      throw new Error("No se pudo modificar el inventario");
    }

    const result = await response.json();
    console.log("Inventario modificado exitosamente:", result);
    return result;
  } catch (error) {
    console.error("Error capturado al modificar inventario:", error);
    throw error;
  }
};

export const eliminarInventario = async (inventarioId) => {
  const url = `${urlBase}inventario/delete/${inventarioId}`;

  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error al eliminar inventario:", errorText);
      throw new Error("No se pudo eliminar el inventario");
    }

    console.log(`Inventario con ID ${inventarioId} eliminado exitosamente`);
    return { success: true };
  } catch (error) {
    console.error("Error capturado al eliminar inventario:", error);
    throw error;
  }
};

export const eliminarCantidadInventario = async ({ producto_id, bodega_id, cantidad_a_eliminar }) => {
  const url = `${urlBase}inventario/remove?producto_id=${producto_id}&bodega_id=${bodega_id}&cantidad_a_eliminar=${cantidad_a_eliminar}`;

  const options = {
    method: "PUT",
    headers: {
      Accept: "application/json",
    },
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error al eliminar cantidad del inventario:", errorText);
      throw new Error("No se pudo eliminar la cantidad del inventario");
    }

    const result = await response.json();
    console.log("Cantidad eliminada del inventario exitosamente:", result);
    return result;
  } catch (error) {
    console.error("Error capturado al eliminar cantidad del inventario:", error);
    throw error;
  }
};

export const listarMovimientos = async () => {
  const url = `${urlBase}movimientos`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("No se pudieron cargar los movimientos");
    }

    const movimientos = await response.json();
    return movimientos;
  } catch (error) {
    console.error("Error al listar movimientos:", error);
    throw error;
  }
};

export const agregarMovimiento = async ({
  movimiento_producto,
  movimiento_descripcion,
  bodega_origen,
  bodega_destino,
  cantidad,
  movimiento_usuario,
}) => {
  const url = `${urlBase}movimientos/add?movimiento_producto=${movimiento_producto}&movimiento_descripcion=${encodeURIComponent(
    movimiento_descripcion
  )}&bodega_origen=${bodega_origen}&bodega_destino=${bodega_destino}&cantidad=${cantidad}&movimiento_usuario=${movimiento_usuario}`;

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error al registrar el movimiento:", errorText);
      throw new Error("No se pudo registrar el movimiento");
    }

    const result = await response.json();
    console.log("Movimiento registrado exitosamente:", result);
    return result;
  } catch (error) {
    console.error("Error capturado al registrar el movimiento:", error);
    throw error;
  }
};

export const listarBodegas = async () => {
  const url = `${urlBase}bodegas`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("No se pudieron cargar las bodegas");
    }

    const bodegas = await response.json();
    return bodegas;
  } catch (error) {
    console.error("Error al listar bodegas:", error);
    throw error;
  }
};

