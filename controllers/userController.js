const UserSchema = require("../models/User");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.createUser = async (req, res) => {
  // revisando si hay errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ err: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let user = await UserSchema.findOne({ email });

    if (user) return res.status(400).json({ msg: "El usuario ya existe" });
    user = new UserSchema(req.body);

    // hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    // token
    // informacion a guardar
    const payload = {
      user: { id: user.id },
    };
    //firmando el token

    jwt.sign(payload, process.env.SECRET, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token, msg: "Usuario creado correctamente" });
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "hubo un error" });
  }
};
