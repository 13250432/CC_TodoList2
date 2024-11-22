const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
	username: {
		type: String,
		minLength: 3,
		maxLength: 50,
		required: true
	},
	password: {
		type: String,
		minLength: 3,
		maxLength: 50,
		required: true
	},
	todos: [
		{
			title: {
				type: String,
				default: 'New To-Do'
			},
			description: String,
			deadline: Date,
			important: {
				type: Boolean,
				default: false
			},
			completed: {
				type: Boolean,
				default: false
			}
		}
	]
});

module.exports = accountSchema;
