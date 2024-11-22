const mongoose = require('mongoose');

const accountSchema = require('../models/account-schema');
const accountModel = mongoose.model('account', accountSchema);

module.exports.handleWebTodos = async (req, res) => {
	// TODO: maybe redirect to register/login page if not authenticated?

	// TODO: use username provided by authentication after it's been implemented?
	let account = await accountModel.findOne({ username: 'account1' }).exec();

	res.status(200).render('index', {
		index: {
			title: 'To-Dos',
			page: 'todos'
		},
		page: {
			todos: account.todos
		}
	});
}

module.exports.handleWebTodosSearch = async (req, res) => {
	// TODO: use username provided by authentication after it's been implemented?
	let account = await accountModel.findOne({ username: 'account1' }).exec();

	let searchResult = findTodosBySearch(account.todos,
										req.body.keywords.split(' '),
										req.body.schedule,
										req.body.importance,
										req.body.completion);

	// TODO: use PRG pattern? to avoid repost pop-up
	res.render('index', {
		index: {
			title: 'To-Dos',
			page: 'todos'
		},
		page: {
			todos: searchResult
		}
	});
}

module.exports.handleApiTodos = async (req, res) => {
	// find a random account for todos
	let account = await accountModel.findOne().exec();

	if (!account) {
		res.status(500).json({ 'error': 'no todos found' });
		return;
	}

	res.status(200).json({ 'todos': account.todos });
}

module.exports.handleApiTodosKeywords = async (req, res) => {
	// find a random account for todos
	let account = await accountModel.findOne().exec();

	if (!account) {
		res.status(500).json({ 'error': 'no todos found' });
		return;
	}

	if (!req.params.keywords) {
		res.status(500).json({ 'error': 'keywords is empty' });
		return;
	}

	let keywordsResult = findTodosByKeywords(account.todos, req.params.keywords.split('-'));
	res.status(200).json({ 'todos': keywordsResult });
}

module.exports.handleApiTodosSchedule = async (req, res) => {
	// find a random account for todos
	let account = await accountModel.findOne().exec();

	// handle no todos found situation
	if (!account) {
		res.status(500).json({ 'error': 'no todos found' });
		return;
	}

	// handle if schedule is empty
	if (!req.params.schedule) {
		res.status(500).json({ 'error': 'schedule is empty' });
		return;
	}

	let scheduleResult = findTodosBySchedule(account.todos, req.params.schedule);
	res.status(200).json({ 'todos': scheduleResult });
}

module.exports.handleApiTodosImportance = async (req, res) => {
	// find a random account for todos
	let account = await accountModel.findOne().exec();

	// handle no todos found situation
	if (!account) {
		res.status(500).json({ 'error': 'no todos found' });
		return;
	}

	// handle if importance is empty
	if (!req.params.importance) {
		res.status(500).json({ 'error': 'importance is empty' });
		return;
	}

	let importanceResult = findTodosByImportance(account.todos, req.params.importance);
	res.status(200).json({ 'todos': importanceResult });
}

module.exports.handleApiTodosCompletion = async (req, res) => {
	// find a random account for todos
	let account = await accountModel.findOne().exec();

	// handle no todos found situation
	if (!account) {
		res.status(500).json({ 'error': 'no todos found' });
		return;
	}

	// handle if completion is empty
	if (!req.params.completion) {
		res.status(500).json({ 'error': 'completion is empty' });
		return;
	}

	let completionResult = findTodosByCompletion(account.todos, req.params.completion);
	res.status(200).json({ 'todos': completionResult });
}

module.exports.handleApiTodosSearch = async (req, res) => {
	// find a random account for todos
	let account = await accountModel.findOne().exec();

	// handle no todos found situation
	if (!account) {
		res.status(500).json({ 'error': 'no todos found' });
		return;
	}

	let searchResult = findTodosBySearch(account.todos,
										req.params.keywords.split('-'),
										req.params.schedule,
										req.params.importance,
										req.params.completion);

	res.status(200).json({ 'todos': searchResult });
}

function findTodosByKeywords(todos, keywords) {
	// return todos if no keywords are provided
	if (keywords.length <= 0) {
		return todos;
	}

	// find todos that matches all the keywords
	let result = [];
	for (let t of todos) {
		// combine title and description
		let combined = t.title.concat(' ', t.description);

		// continue if 'combined' does not contain all 'keywords'
		if (!keywords.every((c) => { return combined.includes(c); })) {
			continue;
		}

		result.push(t);
	}
	return result;
}

function findTodosBySchedule(todos, schedule) {
	let scheduleLowerCase = schedule.toLowerCase();

	// return todos if schedule is set to all
	if (scheduleLowerCase === 'all') {
		return todos;
	}

	// add to result according to schedule parameter
	let result = [];
	for (let t of todos) {
		// if is scheduled (date exists)
		if (scheduleLowerCase === 'scheduled' && t.deadline) {
			result.push(t);
		}
		// if is not scheduled (date null)
		else if (scheduleLowerCase === 'not-scheduled' && !t.deadline) {
			result.push(t);
		}
	}
	return result;
}

function findTodosByImportance(todos, importance) {
	let importanceLowerCase = importance.toLowerCase();

	// return todos if importance is set to all
	if (importanceLowerCase === 'all') {
		return todos;
	}

	// add to result according to importance parameter
	let result = [];
	for (let t of todos) {
		// if is important
		if (importanceLowerCase === 'important' && t.important) {
			result.push(t);
		}
		// if is not important
		else if (importanceLowerCase === 'not-important' && !t.important) {
			result.push(t);
		}
	}
	return result;
}

function findTodosByCompletion(todos, completion) {
	let completionLowerCase = completion.toLowerCase();

	// return todos if completion is set to all
	if (completionLowerCase === 'all') {
		return todos;
	}

	// add to result according to completion parameter
	let result = [];
	for (let t of todos) {
		// if is completed
		if (completionLowerCase === 'completed' && t.completed) {
			result.push(t);
		}
		// if is not completed
		else if (completionLowerCase === 'not-completed' && !t.completed) {
			result.push(t);
		}
	}
	return result;
}

function findTodosBySearch(todos, keywords, schedule, importance, completion) {
	// get results from searching
	let keywordsResult = findTodosByKeywords(todos, keywords);
	let scheduleResult = findTodosBySchedule(todos, schedule);
	let importanceResult = findTodosByImportance(todos, importance);
	let completionResult = findTodosByCompletion(todos, completion);

	// filter in results that exist in all the above results
	return keywordsResult.filter((ele) => {
		return (
			scheduleResult.includes(ele)
			&& importanceResult.includes(ele)
			&& completionResult.includes(ele)
		)
	});
}








// TODO: remove below; test only

// const express = require('express');
// const router = express.Router();

// router.get('/', (req, res) => {
// 	tempCreate();
// 	res.status(200).end();
// });

// async function tempCreate() {
// 	const account = new accountModel({
// 		username: 'account1',
// 		password: 'password',
// 		todos: [
// 			{
// 				title: 'finish s381f project',
// 				description: 'finish s381f project before the deadline',
// 				deadline: new Date(2024, 11, 29),
// 				important: true,
// 				completed: false
// 			},
// 			{
// 				title: 'search test',
// 				description: 'Lorem ipsum odor amet, consectetuer adipiscing elit. Parturient potenti posuere sollicitudin vestibulum duis elit. Eleifend dignissim fames suspendisse cubilia ligula porta. Leo velit maximus facilisi efficitur maximus accumsan. Penatibus lorem phasellus vivamus iaculis tristique sodales pulvinar. Eget purus hendrerit; accumsan turpis malesuada bibendum. Malesuada proin sit mollis aptent ultricies. Eros primis vulputate felis cras ullamcorper. Consequat integer facilisis at dis placerat. Metus class arcu egestas pulvinar hendrerit vivamus mus. Curabitur tristique quis varius dignissim, est pharetra laoreet aenean sodales. Rutrum velit senectus facilisis mi est hendrerit pulvinar natoque. Sit vel blandit sollicitudin nisi ad lacus viverra. Enim dui nibh nulla quis pretium. Hendrerit ligula malesuada eget curae tempus dignissim a vulputate. Molestie risus eleifend suspendisse facilisis et id.',
// 				deadline: null,
// 				important: false,
// 				completed: false
// 			},
// 			{
// 				title: 'finished task',
// 				description: '',
// 				deadline: Date.now(),
// 				important: false,
// 				completed: true
// 			},
// 			{
// 				title: 'do random stuff',
// 				description: '',
// 				deadline: new Date(2099, 12, 31),
// 				important: true,
// 				completed: false
// 			}
// 		]
// 	});

// 	await account.validate();
// 	await account.save();
// }