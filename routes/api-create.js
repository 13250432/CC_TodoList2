const express = require('express');
const Todo = require('../models/Todo');
const User = require('../models/User');
const router = express.Router();

// #region CREATE

/*
    RESTful CREATE (POST): create a new todo

    Example:
        curl -X POST -H "Content-Type: application/json" -d '{"title": "New Todo", "description": "Description here", "user": "username", "important": true}' localhost:8099/api/create-todos
*/
router.post('/create-todos', async (req, res) => {
    const { title, description, user, important, deadline } = req.body;

    // Validate input
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({ 'error': 'Title is required and must be a non-empty string.' });
    }

    if (user) {
        var foundUser = await User.findOne({ username: user }).exec();
        if (!foundUser) {
            return res.status(404).json({ 'error': 'User not found.' });
        }
    }

    // Create new todo
    const newTodo = new Todo({
        title,
        description: description || '',
        user: foundUser ? foundUser._id : null, // Associate with user if found
        important: important || false,
        deadline: deadline || null,
        completed: false // Default value
    });

    try {
        const savedTodo = await newTodo.save();
        res.status(201).json({ 'todo': savedTodo });
    } catch (err) {
        res.status(500).json({ 'error': 'Internal server error while saving the todo.' });
    }
});

// #endregion CREATE

module.exports = router;