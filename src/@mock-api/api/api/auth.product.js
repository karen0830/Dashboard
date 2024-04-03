import instance from "./axios";

const ruta_protegida = () => {
    // Recuperar el token del localStorage
    const token = localStorage.getItem('tokenCompany');
    if (token) {
        const clienteAxios = instance.create({
            headers: {
                'authorization': `Bearer ${token}`
            }
        });
        return clienteAxios;
    } else {
        const clienteAxios = instance.create({
            headers: {
                'authorization': `Bearer null`
            }
        });
        return clienteAxios;
    }
}

export const addProduct = async dataProduct => {
    try {
        const response = ruta_protegida().push("/addProducts", dataProduct);
        return response
    } catch (error) {
        console.log(error);
    }
}

export const updateProductId = async dataProduct => {
    try {
        const response = ruta_protegida().put("/updateProduct", dataProduct);
        return response
    } catch (error) {
        console.log(error);
    }
}

export const getCategories = async dataProduct => {
    try {
        const response = ruta_protegida().get("/getCategories", dataProduct);
        return response
    } catch (error) {
        console.log(error);
    }
}

export const deleteProduct = async id => {
    try {
        const data = {
            id: id
        }
        const response = ruta_protegida().post("/deleteProduct", data);
        return response
    } catch (error) {
        console.log(error);
    }
}

export const getIdP = async id => {
    try {
      // Eliminar el token del localStorage
      const data = {
        id: id
    }
      const response = await ruta_protegida().post('/getIDP', data);
      return response;
    } catch (ex) {
      console.log("error.status:", ex);
    }
}