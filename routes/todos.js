const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

router.get("/", isAuthenticated, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5; // Items per page
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalTodos = await Todo.countDocuments({ user: req.user._id });
    const totalPages = Math.ceil(totalTodos / limit);

    // Get paginated todos
    const todos = await Todo.find({ user: req.user._id })
      .sort({ important: -1, deadline: 1 })
      .skip(skip)
      .limit(limit);

    res.render("todos", {
      todos,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page + 1,
      prevPage: page - 1,
      user: req.user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.post("/", isAuthenticated, async (req, res) => {
  try {
    const todo = new Todo({
      title: req.body.title || undefined,
      description: req.body.description,
      deadline: req.body.deadline || null,
      important: req.body.important === "on",
      user: req.user._id,
    });
    await todo.save();
    res.redirect("/todos");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.post("/:id/edit", isAuthenticated, async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!todo) {
      return res.redirect("/todos");
    }

    todo.title = req.body.title || undefined;
    todo.description = req.body.description;
    todo.deadline = req.body.deadline || null;
    todo.important = req.body.important === "on";

    await todo.save();
    res.redirect("/todos");
  } catch (err) {
    console.error(err);
    res.render("edit-todo", {
      todo: req.body,
      user: req.user,
      error: "Failed to update todo",
    });
  }
});

router.post("/:id/toggle", isAuthenticated, async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (todo) {
      todo.completed = !todo.completed;
      await todo.save();
    }
    res.redirect("/todos");
  } catch (err) {
    console.error(err);
    res.redirect("/todos");
  }
});

router.post("/:id/important", isAuthenticated, async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (todo) {
      todo.important = !todo.important;
      await todo.save();
    }
    res.redirect("/todos");
  } catch (err) {
    console.error(err);
    res.redirect("/todos");
  }
});

router.post("/:id/delete", isAuthenticated, async (req, res) => {
  try {
    await Todo.deleteOne({
      _id: req.params.id,
      user: req.user._id,
    });
    res.redirect("/todos");
  } catch (err) {
    console.error(err);
    res.redirect("/todos");
  }
});

module.exports = router;
