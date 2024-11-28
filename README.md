# Todo List / Task Management

### Group 63

| Members         | Student ID |
| --------------- | ---------- |
| Chan Ka Ming    | 13658740   |
| Chan Wing Chung | 13035418   |
| Yeung Lai Chi   | 12656354   |
| Yeung Man Ngai  | 13642010   |
| Wan Cheuk Yiu   | 13250432   |

# Project File Intro

### `server.js`

this file consists mostly of server set ups, including but not limited to:

- Starting the `express` app with specified port
- Connecting to `mongoose`
- Declaring the use of `express-session` and `passport` for authentication
- Express `routes` to other files under the `routes/` directory for modularity
- Handling 404 errors
- etc.

---

### `package.json`

| Dependencies    | Version |
| --------------- | ------- |
| bcryptjs        | ^2.4.3  |
| body-parser     | *       |
| cookie-session  | *       |
| ejs             | *       |
| express         | *       |
| express-session | *       |
| mongoose        | *       |
| node            | *       |
| nodemon         | *       |
| passport        | *       |
| passport-local  | ^1.0.0  |

---

### `models/` directory

#### `Todo.js`

The todo schema containing information about a todo item and the user who created it.

#### `User.js`

The user schema containing username and password.

---

### `routes/` directory

#### `api-create.js`

The JavaScript file responsible for handling RESTful CREATE (POST) operations.

#### `api-delete.js`

The JavaScript file responsible for handling RESTful DELETE (DELETE) operations.

#### `api-read.js`

The JavaScript file responsible for handling RESTful READ (GET) operations.

#### `api-update.js`

The JavaScript file responsible for handling RESTful UPDATE (PUT) operations.

#### `auth.js`

The JavaScript file responsible for handling web page authentication operations.

#### `todos.js`

The JavaScript file responsible for handling web page todos CRUD operations.

---

### `views/` directory

#### `login.ejs`

The Login Page.

#### `not-found.ejs`

The 404 Not Found page for unknown requests.

#### `register.ejs`

The Registration Page.

#### `todos.ejs`

The Todos Page containing all user-created todos.

# Cloud-Based Server URL

https://cc-todolist2.onrender.com/login

# Operation Guides

## Login / Logout

Logging in is required to access your list of todos. If you do not have an account, you will have to create a new one.

### Registration

This page allows you to register as a new user. If you are registering with an existing username, you will be redirected to the same page.

Once registration is complete, you will be redirected to the Login Page.

![](/public/images/registration-page.png "Registration Page")

1. Enter your username of choice
2. Enter your password of choice
3. Sign up as a new user
4. Redirect to Login Page if you want to log in with an existing account

---

### Login

This page allows you to login as an existing user.

![](/public/images/login-page.png "Login Page")


1. Enter your username
2. Enter your password
3. Log in
4. Redirect to Registration Page if you want to create an account instead

## CRUD Web Pages

### Todos Page

This page performs READ operation to get all the todos a user has created in their account.
Each todo is contained within a block for clarity.
Important todos are always ordered at the top of the list.

![](/public/images/todos-page.png "Todos Page")

1. The todo title
2. The todo description
3. The todo deadline
4. Mark todo as complete / Undo mark todo as complete
5. Mark todo as important / Undo mark todo as important
6. Edit todo
7. Delete todo permanently (DELETE operation)
8. Pagination. Each page holds 5 todo blocks, further ones are pushed to the following pages.
9. Create a new todo
10. Log out

---

### Create a New Todo Popup

When "New Todo" is pressed, this popup appears.

![](/public/images/create-todo-popup.png "Create a New Todo Popup")

1. Enter todo title
2. Enter todo description (optional)
3. Set todo deadline (optional)
4. Mark todo as important
5. Close this popup without creating a new todo
6. Create todo and add it to your account (CREATE operation)

###

---

### Edit a Todo Popup

When "Edit" is pressed on any todo block, this popup appears.

![](/public/images/edit-todo-popup.png "Edit a Todo Popup")

1. Change todo title
2. Change todo description
3. Change todo deadline
4. Mark todo as important / not important
5. Close this popup without updating the todo
6. Save changes made to the todo (UPDATE operation)

## RESTful CRUD Services

Our RESTful CRUD services can be done using the `curl` command in the terminal. Below is a list of exhaustive CRUD services together with usage examples:

### CREATE (POST)

- Create a New Todo

```js
/*
    example 1:
    this commmand creates a new todo:
    1. to the user with the username as "username"
    2. with a title of "New Todo"
    3. with a description of "Description here"
    4. that is important
*/
curl -X POST -H "Content-Type: application/json" -d '{"title": "New Todo", "description": "Description here", "user": "username", "important": true}' localhost:8099/api/create-todos
```

---

### READ (GET)

- Get All Todos from All Users

```js
curl -X GET localhost:8099/api/todos
```

- Get All Users' Todos Containing Specific Keywords

```js
// example 1: find todos containing the 'finish' keyword:
curl -X GET localhost:8099/api/todos/keywords/finish
		
// example 2: find todos containing 'finish' and '381' keywords (separated by hyphens):
curl -X GET localhost:8099/api/todos/keywords/finish-381

// example 3: find all todos:
curl -X GET localhost:8099/api/todos/keywords/-
```

- Get Scheduled Todos from All Users

```js
schedule values:
    all					// all todos whether scheduled or not
    scheduled			// only scheduled todos (has date set)
    not-scheduled		// only unscheduled todos (date not set)

// example 1: find scheduled todos
curl -X GET localhost:8099/api/todos/schedule/scheduled

// example 2: find unscheduled todos
curl -X GET localhost:8099/api/todos/schedule/not-scheduled

// example 3: find all todos:
curl -X GET localhost:8099/api/todos/schedule/all
```

- Get Important Todos from All Users

```js
importance values:
    all					// all todos whether important or not
    important			// only important todos
    not-important		// only unimportant todos

// example 1: find important todos
curl -X GET localhost:8099/api/todos/importance/important
		
// example 2: find unimportant todos
curl -X GET localhost:8099/api/todos/importance/not-important
		
// example 3: find all todos
curl -X GET localhost:8099/api/todos/importance/all
```

- Get Completed Todos from All Users

```js
completion values:
    all					// all todos whether completed or not
    completed			// only completed todos
    not-completed		// only uncompleted todos

// example 1: find completed todos
curl -X GET localhost:8099/api/todos/completion/completed

// example 2: find uncompleted todos
curl -X GET localhost:8099/api/todos/completion/not-completed

// example 3: find all todos
curl -X GET localhost:8099/api/todos/completion/all
```

- Get All Users' Todos Containing All Kinds of Specific Search Param Values

```js
// example 1: find todos containing the 'finish' keyword, that are scheduled
curl -X GET localhost:8099/api/todos/keywords/finish/schedule/scheduled/importance/all/completion/all

// example 2: find todos that are scheduled but uncompleted
curl -X GET localhost:8099/api/todos/keywords/-/schedule/scheduled/importance/all/completion/not-completed

// example 3: find todos containing 'finish' and '381' keywords, that are scheduled, important, but uncompleted
curl -X GET localhost:8099/api/todos/keywords/381/schedule/scheduled/importance/important/completion/not-completed
		
// example 4: find all todos
curl -X GET localhost:8099/api/todos/keywords/-/schedule/all/importance/all/completion/all
```

---

### UPDATE (PUT)

- Update an Existing Todo by ID

```js
/*
    example 1:
    this command updates a todo with specified id:
    1. with a new title "Updated Todo"
    2. with a new description "Updated description"
    3. with important set to false
*/
curl -X PUT -H "Content-Type: application/json" -d '{"title": "Updated Todo", "description": "Updated description", "important": false}' localhost:8099/api/todos/:id
```

---

### DELETE (DELETE)

- Delete All Todos of a Certain User

```js
// example 1: delete todos for the user with username 'def'
curl -X DELETE localhost:8099/api/todos/username/def
```

- Delete Todo by Todo's ID

```js
// examples 1: delete todo where its id is 674852fc7ec8c09cbad9103f
curl -X DELETE localhost:8099/api/todos/todoid/674852fc7ec8c09cbad9103f
```
