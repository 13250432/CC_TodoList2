const express = require('express');
const Todo = require('../models/Todo');
const User = require('../models/User');

// https://stackoverflow.com/a/29231016
const ObjectId = require('mongoose').Types.ObjectId;
const router = express.Router();

// #region DELETE

/*
    RESTful DELETE (DELETE): delete all todos of a certain user

    examples:
        delete todos for the user with username 'def'
            curl -X DELETE localhost:8099/api/todos/username/def
*/
router.delete('/todos/username/:username?', async (req, res) => {
    const user = await User.findOne({ username: req.params.username }).exec();

    if (!req.params.username) {
        res.status(500).json({ 'error': 'username is empty' });
        return;
    }

    if (!user) {
        res.status(500).json({ 'error': 'user not found' });
        return;
    }

    await Todo.deleteMany({ 'user': user._id });
    res.status(200).json({ 'info': 'successfully deleted all todos' });
});

/*
    RESTful DELETE (DELETE): delete todo using id

    examples:
        delete todo where its id is 674852fc7ec8c09cbad9103f
            curl -X DELETE localhost:8099/api/todos/todoid/674852fc7ec8c09cbad9103f
*/
router.delete('/todos/todoid/:todoid?', async (req, res) => {
    const todo = await Todo.findOne({ _id: req.params.todoid }).exec();

    // handle if todoid is empty
	if (!req.params.todoid) {
		res.status(500).json({ 'error': 'id is empty' });
		return;
	}

    // handle if todoid is invalid
    if (!ObjectId.isValid(req.params.todoid)) {
        res.status(500).json({ 'error': 'invalid id format' });
        return;
    }

    // handle if todo with todoid is not found
    if (!todo) {
        res.status(500).json({ 'error': 'todo not found' });
        return;
    }

    await Todo.deleteOne({ _id: todo._id });
    res.status(200).json({ 'info': 'todo successfully deleted' });
});

// #endregion DELETE

module.exports = router;
