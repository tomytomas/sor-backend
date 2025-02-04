"use strict";
import express from "express";
import { getProducts, getProduct } from "../Models/pasteleria.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  console.log("entreee??")
  const data = await getProducts();
  res.json(data);
});

router.get("/:id", async (req, res, next) => {
  const row = await getProduct(req.params.id);
  if (row instanceof Error) return next(row);

  const product = {
    id: row[0].id,
    name: row[0].name,
    price: row[0].price,
    image: row[0].image,
  };

  console.log(product);
  res.json(product);
});

export default router;
