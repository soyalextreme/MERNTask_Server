const express = require("express");
const route = express.Router();
const { check } = require("express-validator");

const userController = require("../controllers/userController");

route.post(
  "/",
  [
    check("name", "el nombre es obligatorio").not().isEmpty(),
    check("email", "Agrega un email válido").isEmail(),
    check("password", "El password debe ser de minimo 6 caracteres").isLength({
      min: 6,
    }),
  ],
  userController.createUser
);

module.exports = route;
