import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import _ from "@lodash";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import {
  useCreateECommerceProductMutation,
  useDeleteECommerceProductMutation,
  useUpdateECommerceProductMutation,
} from "../ECommerceApi";
import { addProduct, getAllProductsId } from "@mock-api/api/api/auth.company";
import { useState } from "react";
import "./modal.css"
import { deleteProduct, getIdP } from "@mock-api/api/api/auth.product";
/*
 * The product header.

*/
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-review">
        <div className="modal-content-review">{children}</div>
      </div>
    </div>
  );
};

function ProductHeader() {
  const routeParams = useParams();
  const { productId } = routeParams;
  const [createProduct] = useCreateECommerceProductMutation();
  const [saveProduct] = useUpdateECommerceProductMutation();
  const [removeProduct] = useDeleteECommerceProductMutation();
  const methods = useFormContext();
  const { formState, watch, getValues } = methods;
  const { isValid, dirtyFields } = formState;
  const theme = useTheme();
  const navigate = useNavigate();
  const { name, images, featuredImageId } = watch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenProduct, setIsModalOpenProduct] = useState(false);


  const openModalProduct = () => {
    setIsModalOpenProduct(true);
  };

  const closeModalProduct = () => {
    setIsModalOpenProduct(false);
  };


  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  function handleSaveProduct() {
    saveProduct(getValues());
  }

  async function handleCreateProduct() {
    const dati = getValues()
    console.log("DDWSS", dati);
    const res = await addProduct(dati);
    console.log(res, "reeesss");
    let verify = res.data ? true : false;
    console.log(verify);
    if (verify) {
      console.log("exitppppppp");
      const newData = await createProduct(dati);
      const products = await getAllProductsId();
      let p = []
      products.data.forEach(element => {
        console.log(element);
        p.push(
          {
            "id": element.id,
            "name": element.name,
            "handle": "",
            "description": element.description,
            "categories": [
              element.nameCategory
            ],
            "featuredImageId": "2",
            "images": [
              {
                "id": "0",
                "url": element.img,
                "type": "image"
              }
            ],
            "priceTaxExcl": element.price,
            "priceTaxIncl": element.price,
            "taxRate": element.taxRate,
            "comparedPrice": element.comparedPrice,
            "quantity": element.stock,
            "sku": element.sku,
            "width": element.width,
            "height": element.height,
            "depth": element.depth,
            "weight": element.weight,
            "extraShippingFee": element.extraShippingFee,
            "active": true,
            "idCompany": element.idCompany,
            "idCategory": element.idCategory
          },
        )
      })
      localStorage.setItem("Products", JSON.stringify(p.reverse()))
      setTimeout(() => {navigate(`/apps/e-commerce/products`)}, 3000)
    } else if (res.response) {
      openModal();
    }
  }


  async function handleRemoveProduct() {
    removeProduct(productId);
    console.log(productId);
    try {
      const deleteP = await deleteProduct(productId)
      console.log(deleteP);
      let verify = deleteP.data ? true : false;
      console.log(verify);
      if (verify) {
        console.log(verify);
        const products = await getAllProductsId();
        let p = []
        products.data.forEach(element => {
          console.log(element);
          p.push(
            {
              "id": element.id,
              "name": element.name,
              "handle": "",
              "description": element.description,
              "categories": [
                element.nameCategory
              ],
              "featuredImageId": "2",
              "images": [
                {
                  "id": "0",
                  "url": element.img,
                  "type": "image"
                }
              ],
              "priceTaxExcl": element.price,
              "priceTaxIncl": element.price,
              "taxRate": element.taxRate,
              "comparedPrice": element.comparedPrice,
              "quantity": element.stock,
              "sku": element.sku,
              "width": element.width,
              "height": element.height,
              "depth": element.depth,
              "weight": element.weight,
              "extraShippingFee": element.extraShippingFee,
              "active": true,
              "idCompany": element.idCompany,
              "idCategory": element.idCategory
            },
          )
        })
        localStorage.setItem("Products", JSON.stringify(p.reverse()))
        navigate("/apps/e-commerce/products");
      } else {
        openModal();
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row flex-1 w-full items-center justify-between space-y-8 sm:space-y-0 py-24 sm:py-32 px-24 md:px-32">
      <div className="flex flex-col items-start space-y-8 sm:space-y-0 w-full sm:max-w-full min-w-0">
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
        >
          <Typography
            className="flex items-center sm:mb-12"
            component={Link}
            role="button"
            to="/apps/e-commerce/products"
            color="inherit"
          >
            <FuseSvgIcon size={20} className="text-white">
              {theme.direction === "ltr"
                ? "heroicons-outline:arrow-sm-left"
                : "heroicons-outline:arrow-sm-right"}
            </FuseSvgIcon>
            <span className="flex mx-4 font-medium text-white">Productos</span>
          </Typography>
        </motion.div>

        <div className="flex items-center max-w-full">
          <motion.div
            className="hidden sm:flex"
            initial={{ scale: 0 }}
            animate={{ scale: 1, transition: { delay: 0.3 } }}
          >
            {console.log("Images", images)}
            {images.length > 0 ? (
              <img
                className="w-32 sm:w-48 rounded"
                src={images[0].url}
                alt={name}
              />
            ) : null}
          </motion.div>
          <motion.div
            className="flex flex-col min-w-0 mx-8 sm:mx-16"
            initial={{ x: -20 }}
            animate={{ x: 0, transition: { delay: 0.3 } }}
          >
            <Typography className="text-16 sm:text-20 truncate font-semibold text-white">
              {name || "Nuevo Producto"}
            </Typography>
            <Typography variant="caption" className="font-medium text-blue-700">
              Detalle del producto
            </Typography>
          </motion.div>
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            <h2 className="Tile-Review">Comentario Subido</h2>
            <p className="P-content-Review">Tu comentario ha sido subido exitosamente. Gracias por tu aporte.</p>
            <button onClick={closeModal}>Cerrar</button>
          </Modal>
          <Modal isOpen={isModalOpenProduct} onClose={closeModalProduct}>
            <h2 className="Tile-Review">Eliminar Producto</h2>
            <p className="P-content-Review">¿Estás seguro de que quieres eliminar este producto?</p>
            <div className="options-delete">
              <button onClick={closeModalProduct}>Cancelar</button>
              <button onClick={handleRemoveProduct}>Eliminar</button>
            </div>
          </Modal>

        </div>
      </div>
      <motion.div
        className="flex flex-1 w-full"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
      >
        {productId !== "new" ? (
          <>
            <Button
              className="whitespace-nowrap mx-4"
              variant="contained"
              onClick={openModalProduct}
              style={{ color: "#287bff" }}
              startIcon={
                <FuseSvgIcon className="hidden sm:flex">
                  heroicons-outline:trash
                </FuseSvgIcon>
              }
            >
              Quitar
            </Button>
            <Button
              className="whitespace-nowrap mx-4"
              variant="contained"
              disabled={_.isEmpty(dirtyFields) || !isValid}
              onClick={handleSaveProduct}
              style={{ color: "#287bff" }}
            >
              Guardar
            </Button>
          </>
        ) : (
          <Button
            className="whitespace-nowrap mx-4"
            variant="contained"
            onClick={handleCreateProduct}
            disabled={_.isEmpty(dirtyFields) || !isValid}
            style={{ color: "white" }}
          >
            Añadir
          </Button>
        )}
      </motion.div>
    </div>
  );
}

export default ProductHeader;


