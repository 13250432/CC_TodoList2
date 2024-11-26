// by Akira

const mongoose = require('mongoose');
const accountSchema = require('../models/account-schema');
const accountModel = mongoose.model('account', accountSchema);

module.exports.renderCreateTodo = (req, res) => {
    res.render('create-todos', {
        index: {
            title: 'Create To-Do',
            page: 'create-todos'
        }
    });
};

module.exports.handleCreateTodo = async (req, res) => {
    try {
        const username = req.session.username; // get login username

        const account = await accountModel.findOne({ username }).exec();
        if (!account) {
            return res.status(404).send('Account not found');
        }

        // Create new To-Do item
        const newTodo = {
            title: req.body.title,
            description: req.body.description,
            deadline: req.body.deadline ? new Date(req.body.deadline) : null,
            important: req.body.important === 'on',
            completed: false
        };

        account.todos.push(newTodo);
        await account.save();

        res.redirect('/todos'); 
    } catch (err) {
        console.error(err);
        res.status(500).send('error');
    }
};
