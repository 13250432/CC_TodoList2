const express = require('express');
const Todo = require('../models/Todo');
const router = express.Router();

// #region READ

/*
	RESTful READ (GET): all todos from all users

	examples:
		curl -X GET localhost:8099/api/todos
*/
router.get('/todos', async (req, res) => {
	const todos = await Todo.find().exec();

	// handle no todos found situation
	if (!todos.length) {
		res.status(500).json({ 'error': 'no todos found' });
		return;
	}

	res.status(200).json({ 'todos': todos });
});

/*
	RESTful READ (GET): all users' todos containing specific keywords

	examples:
		find todos containing the 'finish' keyword:
			curl -X GET localhost:8099/api/todos/keywords/finish
		find todos containing 'finish' and '381' keywords (separated by hyphens):
			curl -X GET localhost:8099/api/todos/keywords/finish-381
		find all todos:
			curl -X GET localhost:8099/api/todos/keywords/-
*/
router.get('/todos/keywords/:keywords?', async (req, res) => {
	const todos = await Todo.find().exec();

    // handle if keywords is empty
	if (!req.params.keywords) {
		res.status(500).json({ 'error': 'keywords is empty' });
		return;
	}

	// handle no todos found situation
	if (!todos.length) {
		res.status(500).json({ 'error': 'no todos found' });
		return;
	}

	res.status(200).json({
        'todos': findTodosByKeywords(todos, req.params.keywords.split('-'))
    });
});

/*
	RESTful READ (GET): scheduled todos from all users

	schedule values:
		all					// all todos whether scheduled or not
		scheduled			// only scheduled todos (has date set)
		not-scheduled		// only unscheduled todos (date not set)

	examples:
		find scheduled todos:
			curl -X GET localhost:8099/api/todos/schedule/scheduled
		find unscheduled todos:
			curl -X GET localhost:8099/api/todos/schedule/not-scheduled
		find all todos:
			curl -X GET localhost:8099/api/todos/schedule/all
*/
router.get('/todos/schedule/:schedule?', async (req, res) => {
	const todos = await Todo.find().exec();

    // handle if schedule is empty
	if (!req.params.schedule) {
		res.status(500).json({ 'error': 'schedule is empty' });
		return;
	}

	// handle no todos found situation
	if (!todos.length) {
		res.status(500).json({ 'error': 'no todos found' });
		return;
	}

	res.status(200).json({
        'todos': findTodosBySchedule(todos, req.params.schedule)
    });
});

/*
	RESTful READ (GET): important todos from all users

	importance values:
		all					// all todos whether important or not
		important			// only important todos
		not-important		// only unimportant todos

	examples:
		find important todos:
			curl -X GET localhost:8099/api/todos/importance/important
		find unimportant todos:
			curl -X GET localhost:8099/api/todos/importance/not-important
		find all todos:
			curl -X GET localhost:8099/api/todos/importance/all
*/
router.get('/todos/importance/:importance?', async (req, res) => {
	const todos = await Todo.find().exec();

    // handle if importance is empty
	if (!req.params.importance) {
		res.status(500).json({ 'error': 'importance is empty' });
		return;
	}

	// handle no todos found situation
	if (!todos.length) {
		res.status(500).json({ 'error': 'no todos found' });
		return;
	}

	res.status(200).json({
        'todos': findTodosByImportance(todos, req.params.importance)
    });
});

/*
	RESTful READ (GET): completed todos from all users

	completion values:
		all					// all todos whether completed or not
		completed			// only completed todos
		not-completed		// only uncompleted todos

	examples:
		find completed todos:
			curl -X GET localhost:8099/api/todos/completion/completed
		find uncompleted todos:
			curl -X GET localhost:8099/api/todos/completion/not-completed
		find all todos:
			curl -X GET localhost:8099/api/todos/completion/all
*/
router.get('/todos/completion/:completion?', async(req, res) => {
	const todos = await Todo.find().exec();

    // handle if completion is empty
	if (!req.params.completion) {
		res.status(500).json({ 'error': 'completion is empty' });
		return;
	}

	// handle no todos found situation
	if (!todos.length) {
		res.status(500).json({ 'error': 'no todos found' });
		return;
	}

	res.status(200).json({
        'todos': findTodosByCompletion(todos, req.params.completion)
    });
});

/*
	RESTful READ (GET): all users' todos containing all kinds of specific search param values

	examples:
		find todos containing the 'finish' keyword, that are scheduled:
			curl -X GET localhost:8099/api/todos/keywords/finish/schedule/scheduled/importance/all/completion/all
		find todos that are scheduled but uncompleted:
			curl -X GET localhost:8099/api/todos/keywords/-/schedule/scheduled/importance/all/completion/not-completed
		find todos containing 'finish' and '381' keywords, that are scheduled, important, but uncompleted:
			curl -X GET localhost:8099/api/todos/keywords/381/schedule/scheduled/importance/important/completion/not-completed
		find all todos:
			curl -X GET localhost:8099/api/todos/keywords/-/schedule/all/importance/all/completion/all
*/
router.get('/todos/keywords/:keywords?/schedule/:schedule?/importance/:importance?/completion/:completion?', async (req, res) => {
	const todos = await Todo.find().exec();

	// handle no todos found situation
	if (!todos.length) {
		res.status(500).json({ 'error': 'no todos found' });
		return;
	}

	res.status(200).json({
        'todos': findTodosBySearch(todos,
                                req.params.keywords.split('-'),
                                req.params.schedule,
                                req.params.importance,
                                req.params.completion)
    });
});

// #endregion READ

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

module.exports = router;
