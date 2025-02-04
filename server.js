
import express from "express";
import cors from "cors";
import 'dotenv/config'
const app = express();
const PORT = process.env.PORT || 8080; 
const SERVER_URL = process.env.URL || "http://localhost";
import session from "express-session";
import productsRouter from "./Routes/products.js";
import datos from "./Routes/datos.js";
import routeLogin from"./Routes/login.js";
import destacados from "./Routes/destacadosData.js"
import promo from "./Routes/promoData.js";
import sanValentin from "./Routes/sanValentinData.js"
// Middleware
app.use(express.json());
app.use(cors());
//mp
// Requerir MercadoPagoConfig y Preference

import { MercadoPagoConfig, Preference } from "mercadopago";

const mercadopagoClient = new MercadoPagoConfig({
  accessToken:  'APP_USR-270305518395196-012814-1ef1b9270f2e8887d7e479a16e607ca8-2234059419',
});

app.get('/', (req, res) => {
  res.send('¡Hola Mundo desde el backend! 🌎');
  res.send('¡El servidor está funcionando correctamente! 🚀');
});
app.post("/create_preference", async (req, res) => {
  try {
    console.log(req.body.title)
    console.log(req.body.unit_price)
    const body = {
      items: [
        {
          title: req.body.title,
          quantity: Number(req.body.quantity),
          unit_price: req.body.unit_price,
          currency_id: "ARS",
        },
      ],
      back_urls: {
        success: "https://martin-juncos.github.io/success/",
        failure: "https://martin-juncos.github.io/failure/",
        pending: "https://martin-juncos.github.io/pending/",
      },
      auto_return: "approved",
    };
    const preference = new Preference(mercadopagoClient);
    const result = await preference.create({ body });
    res.json({
      id: result.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating preference");
  }
});

app.use("/datapromo", promo)
app.use("/datasanvalentin", sanValentin)
app.use("/datadestacada", destacados)
app.use("/products", productsRouter)
app.use("/login", routeLogin);
app.use("/datos", datos);
app.use("/success", async (req, res) => {
app.use(
    session({
      secret: "keyboard cat",
      resave: true,
      saveUninitialized: true,
    })
  );
res.send('todo okkk')
});


// Iniciar el servidor

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

