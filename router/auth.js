const express = require("express");
const route = express();

const { check } = require("express-validator");

const auth = require("../middleware/auth");
const authController = require("../controllers/authController");

// /api/auth

route.post("/", [
  check("email", "Agrega un email válido").isEmail(),
  check("password", "El password debe ser de minimo 6 caracteres").isLength({
    min: 6,
  }),
  authController.authUser,
]);

route.get("/", auth, authController.verifyAuth);
module.exports = route;
