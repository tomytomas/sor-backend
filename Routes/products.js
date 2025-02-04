"use strict";
import express from "express";
import util from "util";
import { body, validationResult } from "express-validator";
import { getProducts, addProduct, deleteProduct, getProduct, modifyProduct } from "../Models/pasteleria.js";
import multer from "multer"
const router = express.Router();

router.get("/", async (req, res, next) => {
  const data = await getProducts();
  if (data instanceof Error) return next(data);
  res.render("products", { user: req.session.user, data });
});

router.get("/addItem", (req, res) => {
  res.render("addItem");
});

router.post(
  "/addItem",
  [
    body("name", "El nombre del producto es requerido").exists().trim().isLength({ min: 3 }),
    body("price", "El precio debe ser un número").exists().isNumeric(),
    body("image", "La imagen es requerida").exists().trim().isLength({ min: 8 }),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validaciones = errors.array();
      let primerError = validaciones[0];
      console.log(validaciones);
      console.log(primerError.msg);
      return res.status(400).json({ message: primerError.msg });
    }

    console.log(req.body);
    const dbResponse = await addProduct({ ...req.body });
    if (dbResponse instanceof Error) return next(dbResponse);

    res.status(200).json({ message: "Producto agregado correctamente" });
  }
);

router.get("/handleEdit/:id", async (req, res, next) => {
  const row = await getProduct(req.params.id);
  if (row instanceof Error) return next(row);

  const product = {
    id: row[0].id,
    name: row[0].name,
    price: row[0].price,
    image: row[0].image,
  };

  res.render("handleEdit", { product });
});

router.get("/deleteProduct/:id", async (req, res, next) => {
  console.log("Entre a borrar producto");
  const row = await getProduct(req.params.id);
  if (row instanceof Error) return next(row);

  await deleteProduct(req.params.id);
  res.status(200).json({ message: "Producto eliminado correctamente" });
});

// Configuración de `multer`
const upload = multer({ storage: multer.memoryStorage() });

router.post("/editProduct", upload.single("image"), async (req, res, next) => {
  console.log("Cuerpo recibido:", req.body);
  

  // Validar errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const primerError = errors.array()[0];
    console.log(primerError.msg);
    return res.status(400).json({ message: primerError.msg });
  }

  // Obtener el producto antes de modificarlo
  const row = await getProduct(req.body.id);
  if (row instanceof Error) return next(row);

  const data = {
    id: req.body.id,
    name: req.body.name,
    price: req.body.price,
    image: req.body.image, // Si hay archivo, convertirlo a base64
  };

  console.log(`Editando producto ID: ${data.id}`);
  await modifyProduct(data, data.id);

  res.status(200).json({ message: "Producto editado correctamente" });
});

export default router;
