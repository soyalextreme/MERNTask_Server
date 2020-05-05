const ProjectSchema = require("../models/Project");
const { validationResult } = require("express-validator");

exports.createProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ err: errors.array() });
  }

  try {
    // create a new project
    const project = new ProjectSchema(req.body);
    project.owner = req.user.id;
    await project.save();
    res.json(project);
  } catch (err) {
    console.log(err);
    res.status(500).send("Hubo un error");
  }
};

exports.getProject = async (req, res) => {
  try {
    const projects = await ProjectSchema.find({ owner: req.user.id }).sort({
      dateCreated: -1,
    });
    res.json({ projects });
  } catch (err) {
    console.log(err);
    res.status(500).send("Hubo un error");
  }
};

exports.updateProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ err: errors.array() });
  }

  const { name } = req.body;
  const newProject = {};

  if (name) {
    newProject.name = name;
  }

  try {
    let project = await ProjectSchema.findById({ _id: req.params.id });

    if (!project)
      return res.status(404).json({ msg: "Proyecto no encontrado" });

    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: "No auth" });
    }

    project = await ProjectSchema.findOneAndUpdate(
      { _id: req.params.id },
      { $set: newProject },
      { new: true }
    );

    res.json({ project });
  } catch (err) {
    console.log(err);
    res.status(500).send("Hubo un error con los servidores");
  }
};

exports.deleteProject = async (req, res) => {
  try {
    let project = await ProjectSchema.findById({ _id: req.params.id });

    if (!project)
      return res.status(404).json({ msg: "Proyecto no encontrado" });

    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: "No auth" });
    }

    // deleting
    await ProjectSchema.findOneAndRemove({ _id: req.params.id });

    res.json({ msg: "Proyecto eliminado" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Ocurrio un error");
  }
};
