const express = require("express");
const route = express.Router();
const projectController = require("../controllers/projectController");
const auth = require("../middleware/auth");
const { check } = require("express-validator");

// create projects
// /api/project
route.post(
  "/",
  auth,
  [check("name", "El nombre del proyecto es onligatorio").not().isEmpty()],
  projectController.createProject
);
route.get("/", auth, projectController.getProject);
route.put(
  "/:id",
  auth,
  [check("name", "El nombre del proyecto es onligatorio").not().isEmpty()],
  projectController.updateProject
);

route.delete("/:id", auth, projectController.deleteProject);

module.exports = route;
