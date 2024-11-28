const express = require('express');
const Todo = require('../models/Todo');
const User = require('../models/User');
const router = express.Router();

// #region UPDATE

/*
    RESTful UPDATE (PUT): update an existing todo by ID

    Example:
        curl -X PUT -H "Content-Type: application/json" -d '{"title": "Updated Todo", "description": "Updated description", "important": false}' localhost:8099/api/todos/:id
*/
router.put('/todos/:id', async (req, res) => {
    const { title, description, important, deadline } = req.body;
    const todoId = req.params.id;

    try {
        const todo = await Todo.findById(todoId);

        if (!todo) {
            return res.status(404).json({ 'error': 'Todo not found.' });
        }

        // Update todo fields if provided in the request
        if (title) {
            todo.title = title;
        }
        if (description) {
            todo.description = description;
        }
        if (important !== undefined) {
            todo.important = important;
        }
        if (deadline) {
            todo.deadline = deadline;
        }

        const updatedTodo = await todo.save();
        res.json({ 'todo': updatedTodo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ 'error': 'Internal server error while updating the todo.' });
    }
});

// #endregion UPDATE

module.exports = router;
