const express = require("express");
var cors = require("cors");
const app = express();
require("dotenv").config();
const { validarToken } = require('./middlewares/Auth')
// const Categories = require('./models/categories');
// const Products = require('./models/products');

const router = require("./routes/index");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,DELETE,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  app.use(cors());
  next();
});

app.get("/", function (request, response) {
  response.send("Serviço API Rest iniciada...");
});

// app.get("/validatoken", validarToken, async (req, res) => {
//     await User.findByPk(req.userId, {
//       attributes: ["id", "name", "email"],
//     })
//       .then((user) => {
//         return res.status(200).json({
//           erro: false,
//           user,
//         });
//       })
//       .catch(() => {
//         return res.status(400).json({
//           erro: true,
//           mensagem: "Erro: Necessário realizar o login!!!",
//         });
//       });
//   });

app.use(router);

app.listen(process.env.PORT, () => {
  console.log(
    `Servidor iniciado na porta ${process.env.PORT} http://localhost:${process.env.PORT}`
  );
});
