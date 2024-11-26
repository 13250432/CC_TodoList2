// requires
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// setups
const app = express();
const mongoDBUri = `${process.env.MONGODB_URI}`;

// set ejs as the view engine
app.set('view engine', 'ejs');

// set json spaces to 4 (might be easier to read in curl outputs)
// https://expressjs.com/en/5x/api.html#app.set
app.set('json spaces', 4);

// use static directory 'public'
app.use(express.static('public'));

// use bodyParser middlewares (json and urlencoded)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// #region webpage CREATE requests (by Akira)

const createController = require('./controllers/create-controller');
const session = require('express-session');

app.use(session({
    secret: 'SeCrEt',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.get('/create-todos', createController.renderCreateTodo);
app.post('/create-todos', createController.handleCreateTodo);

// #endregion webpage CREATE requests

// #region webpage READ requests

// require read-controller for read operations
// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes#create_the_catalog_route_module
const readController = require('./controllers/read-controller');

/*
	webpage READ (GET): all todos

	http://localhost:8099/todos
*/
app.get('/todos', readController.handleWebTodos);

/*
	webpage READ (POST): search todos with specific param values

	can only be done inside webpage:
	http://localhost:8099/todos
*/
app.post('/search-todos', readController.handleWebTodosSearch);

// #endregion webpage READ requests

// #region RESTful READ requests

/*
	RESTful READ (GET): all todos

	examples:
		curl -X GET localhost:8099/api/todos
*/
app.get('/api/todos', readController.handleApiTodos);

/*
	RESTful READ (GET): todos containing specific keywords

	examples:
		find todos containing the 'finish' keyword:
			curl -X GET localhost:8099/api/todos/keywords/finish
		find todos containing 'finish' and '381' keywords (separated by hyphens):
			curl -X GET localhost:8099/api/todos/keywords/finish-381
		find all todos:
			curl -X GET localhost:8099/api/todos/keywords/-
*/
app.get('/api/todos/keywords/:keywords?', readController.handleApiTodosKeywords);

/*
	RESTful READ (GET): scheduled todos

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
app.get('/api/todos/schedule/:schedule?', readController.handleApiTodosSchedule);

/*
	RESTful READ (GET): important todos

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
app.get('/api/todos/importance/:importance?', readController.handleApiTodosImportance);

/*
	RESTful READ (GET): completed todos

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
app.get('/api/todos/completion/:completion?', readController.handleApiTodosCompletion);

/*
	RESTful READ (GET): todos containing all kinds of specific search param values

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
app.get('/api/todos/keywords/:keywords?/schedule/:schedule?/importance/:importance?/completion/:completion?', readController.handleApiTodosSearch);

// #endregion RESTful READ requests

// TODO: remove this; test only
app.get('/', readController.testTempCreate);

// handle 404 cases (webpage)
// put this under all the request stacks
app.use((req, res) => {
	console.log('404: request not found');
	res.status(404).render('index',{
		index: {
			title: '404',
			page: 'not-found'
		}
	});
});

// #region mongoose

async function initMongoose() {
	await mongoose.connect(mongoDBUri);
	console.log('mongoose: connected to mongodb!');
}

initMongoose()
	.then()
	.catch((error) => {
		console.log(error);
	})
	.finally();

// #endregion mongoose

app.listen(process.env.PORT);
console.log(`listening on port: ${[process.env.PORT]}`);
