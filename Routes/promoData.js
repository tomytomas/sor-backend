import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const filePath = path.join(process.cwd(), 'dataPromo.json');

// Leer los productos desde el JSON
const leerDatos = () => {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error al leer el archivo JSON:", error);
    return [];
  }
};

// Escribir los productos en el JSON
const guardarDatos = (productos) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(productos, null, 2));
  } catch (error) {
    console.error("Error al guardar el archivo JSON:", error);
  }
};

// **GET** - Obtener todos los productos
router.get("/", (req, res) => {
  
  const datos = leerDatos();
  res.json(datos);
});

// **PUT** - Editar un producto
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, price, image } = req.body;

  let datos = leerDatos();
  const index = datos.findIndex((p) => p.id === Number(id));

  if (index !== -1) {
    datos[index] = { id: Number(id), title, description, price, image };
    guardarDatos(datos);
    res.json({ message: "Datos actualizados correctamente" });
  } else {
    res.status(404).json({ message: "dato no encontrado" });
  }
});

// Agregar producto
router.post("/destacados", (req, res) => {
 
  const productos = leerDatos();
  const nuevoProducto = { id: Date.now(), ...req.body };
  productos.push(nuevoProducto);
  guardarDatos(productos);
  res.status(201).json(nuevoProducto);
});

// Eliminar producto
router.delete("/destacados/:id", (req, res) => {
  let productos = leerDatos();
  productos = productos.filter((p) => p.id !== parseInt(req.params.id));
  guardarDatos(productos);
  res.json({ message: "Producto eliminado" });
});








export default router;
