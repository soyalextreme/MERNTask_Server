const express = require("express");
const route = express.Router();
const taskController = require("../controllers/taskController");
const auth = require("../middleware/auth");
const { check } = require("express-validator");

route.post(
  "/",
  auth,
  [
    check("name", "El Nombre es obligatorio").not().isEmpty(),
    check("projectId", "El Proyecto es obligatorio").not().isEmpty(),
  ],
  taskController.createTask
);

route.get(
  "/",
  auth,
  [check("projectId", "El Proyecto es obligatorio")],
  taskController.getTask
);

route.put(
  "/:id",
  auth,
  [check("projectId", "El Proyecto es obligatorio")],
  taskController.updateTask
);

route.delete(
  "/:id",
  auth,
  [check("projectId", "El Proyecto es obligatorio")],
  taskController.deleteTask
);

module.exports = route;
