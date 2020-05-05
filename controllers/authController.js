const UserSchema = require("../models/User");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.authUser = async (req, res) => {
  // revisando si hay errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ err: errors.array() });
  }

  // extraer email y password

  const { email, password } = req.body;

  try {
    let userFind = await UserSchema.findOne({ email });

    if (!userFind) {
      return res.status(400).json({ msg: "el usuario no existe" });
    }

    const passIsValid = await bcrypt.compare(password, userFind.password);

    if (!passIsValid) {
      return res.status(400).json({ msg: "Password incorrecto" });
    }

    const payload = {
      user: { id: userFind.id },
    };

    jwt.sign(payload, process.env.SECRET, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token, msg: "Iniciando sesion correctamente" });
    });
  } catch (error) {
    console.log(error);
  }
};

exports.verifyAuth = async (req, res) => {
  try {
    const user = await UserSchema.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (error) {
    console.log(error.response);
    res.status(500).send("hubo un error");
  }
};
