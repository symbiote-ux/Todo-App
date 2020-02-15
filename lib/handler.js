const express = require('express');
const { TodoStore } = require('./todoStore');
const config = require('../config');
const TODO_STORE = config.DATA_STORE || `${__dirname}/../dataStore/todo.json`;
const { loadUserIdStore, writeToUserIdStore } = require('./fileOperations');

const todoStore = TodoStore.load(TODO_STORE);

const editTask = (req, res, next) => {
  const { todoId, taskId, task } = req.body;
  if (todoId && taskId && task) {
    todoStore.editTask(todoId, taskId, task);
    res.json(todoStore.allTodo);
  }
  next();
};

const editTitle = (req, res, next) => {
  const { todoId, title } = req.body;
  if (todoId && title) {
    todoStore.editTitle(todoId, title);
    res.json(todoStore.allTodo);
  }
  next();
};

const deleteTask = (req, res, next) => {
  const { todoId, taskId } = req.body;
  if (todoId && taskId) {
    todoStore.deleteTask(todoId, taskId);
    res.json(todoStore.allTodo);
  }
  next();
};

const insertTask = (req, res, next) => {
  const { todoId, taskContent } = req.body;
  if (todoId && taskContent) {
    todoStore.insertTask(todoId, taskContent);
    res.json(todoStore.allTodo);
  }
  next();
};

const deleteTodo = (req, res, next) => {
  const { todoId } = req.body;
  if (todoId) {
    todoStore.deleteTodo(todoId);
    res.json(todoStore.allTodo);
  }
  next();
};

const updateTaskStatus = (req, res, next) => {
  const { todoId, taskId } = req.body;
  if (todoId && taskId) {
    todoStore.updateTaskStatus(todoId, taskId);
    res.json(todoStore.allTodo);
  }
  next();
};
const saveNewTodo = (req, res, next) => {
  const { title, tasks } = req.body;
  if (title && tasks) {
    const timeStamp = new Date().getTime();
    todoStore.addTodo(title, tasks, timeStamp);
    res.json(todoStore.allTodo);
  }
  next();
};

const serveTodoList = (req, res) => {
  res.json(todoStore.allTodo);
};

const serveLoginPage = (req, res) => res.redirect('login.html');

const statusCodes = {
  ok: 200,
  unauthorized: 401,
  conflict: 409
};

const signUp = (req, res) => {
  const allUserData = loadUserIdStore();
  const matchedUser = allUserData.find(
    user => user.userName === req.body.userName
  );
  if (matchedUser) {
    res.sendStatus(statusCodes.conflict);
  } else {
    todoStore.initiateUser(req.body.userName);
    allUserData.push(req.body);
    writeToUserIdStore(JSON.stringify(allUserData));
    res.sendStatus(statusCodes.ok);
  }
};

const login = (req, res) => {
  const allUserData = loadUserIdStore();
  const { userName, password } = req.body;
  const matchedUser = allUserData.find(
    user => user.userName === userName && user.password === password
  );
  if (matchedUser) {
    todoStore.assignUser(userName);
    res.redirect('/index.html');
  } else {
    res.sendStatus(statusCodes.unauthorized);
  }
};

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get('/', serveLoginPage);
app.post('/signUp', signUp);
app.post('/login', login);
app.use(express.static('public'));
app.get('/getTodoList', serveTodoList);

app.post('/saveTodo', saveNewTodo);
app.post('/updateTaskStatus', updateTaskStatus);
app.post('/deleteTodo', deleteTodo);
app.post('/insertTask', insertTask);
app.post('/deleteTask', deleteTask);
app.post('/editTitle', editTitle);
app.post('/editTask', editTask);

module.exports = { app };
