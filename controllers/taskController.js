const TaskModel = require("../models/Task");
const ProjectModel = require("../models/Project");
const { validationResult } = require("express-validator");

//! crea una nueva tarea

exports.createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ err: errors.array() });
  }

  const { projectId } = req.body;

  try {
    const project = await ProjectModel.findById(projectId);

    if (!project) return res.status(404).json({ msg: "Proyecto no econtrado" });

    // check owner
    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: "No auth" });
    }

    // create task

    const task = new TaskModel(req.body);
    await task.save();

    res.json({ task });
  } catch (error) {
    console.log(error);
    res.status(500).send("hubo un error");
  }
};

//! Obtain tasks

exports.getTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ err: errors.array() });
  }

  const { projectId } = req.query;

  try {
    const project = await ProjectModel.findById(projectId);

    if (!project) return res.status(404).json({ msg: "Proyecto no econtrado" });

    // check owner
    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: "No auth" });
    }

    const task = await TaskModel.find({ projectId });
    res.json({ task });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//! update task

exports.updateTask = async (req, res) => {
  const { projectId, name, state } = req.body;

  try {
    const project = await ProjectModel.findById(projectId);

    // check owner
    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: "No auth" });
    }

    let taskFind = await TaskModel.findById(req.params.id);

    if (!taskFind) return res.status(404).json({ msg: "La tarea no existe" });

    let newTask = {};
    if (name) {
      newTask.name = name;
    }
    if (state) {
      newTask.state = state;
    }

    taskFind = await TaskModel.findOneAndUpdate(
      { _id: req.params.id },
      newTask,
      { new: true }
    );

    res.json(taskFind);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//! Deleting a task

exports.deleteTask = async (req, res) => {
  const { projectId } = req.query;

  try {
    const project = await ProjectModel.findById(projectId);

    // check owner
    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: "No auth" });
    }

    let taskFind = await TaskModel.findById(req.params.id);

    if (!taskFind) return res.status(404).json({ msg: "La tarea no existe" });

    await TaskModel.findByIdAndDelete({ _id: req.params.id });

    res.json({ msg: `eliminando tarea ${taskFind.name}` });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};
