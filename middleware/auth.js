const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
  // read the token
  const token = req.header("x-auth-token");

  // see if theres no token
  if (!token)
    return res.status(401).json({ msg: "No hay token permiso no valido" });

  // validate the token

  try {
    const payload = jwt.verify(token, process.env.SECRET);
    req.user = payload.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token no valido" });
  }
};
