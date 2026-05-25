const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");
const auth = require("../middleware/auth");

// Get all todos
router.get("/", auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.userData.userId });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
});

// Create todo
router.post("/", auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    const todo = new Todo({
      user: req.userData.userId,
      title,
      description,
    });
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
});

// Update todo
router.put("/:id", auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.userData.userId },
      req.body,
      { new: true },
    );
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
});

// Delete todo
router.delete("/:id", auth, async (req, res) => {
  try {
    await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.userData.userId,
    });
    res.status(200).json({ message: "Todo deleted!" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
});

module.exports = router;
