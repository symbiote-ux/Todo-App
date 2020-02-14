const express = require('express');
const {TodoList} = require('./todoList');
const {loadDataStoreContents, writeToDataStore} = require('./fileOperations');
const todoList = TodoList.load(loadDataStoreContents());

const editTask = (req, res, next) => {
  const {todoId, taskId, task} = req.body;
  if (todoId && taskId && task) {
    todoList.editTask(todoId, taskId, task);
    writeToDataStore(todoList.toText());
    res.json(todoList.allTodo);
  }
  next();
};

const editTitle = (req, res, next) => {
  const {todoId, title} = req.body;
  if (todoId && title) {
    todoList.editTitle(todoId, title);
    writeToDataStore(todoList.toText());
    res.json(todoList.allTodo);
  }
  next();
};

const deleteTask = (req, res, next) => {
  const {todoId, taskId} = req.body;
  if (todoId && taskId) {
    todoList.deleteTask(todoId, taskId);
    writeToDataStore(todoList.toText());
    res.json(todoList.allTodo);
  }
  next();
};

const insertTask = (req, res, next) => {
  const {todoId, taskContent} = req.body;
  if (todoId && taskContent) {
    todoList.insertTask(todoId, taskContent);
    writeToDataStore(todoList.toText());
    res.json(todoList.allTodo);
  }
  next();
};

const deleteTodo = (req, res, next) => {
  const {todoId} = req.body;
  if (todoId) {
    todoList.deleteTodo(todoId);
    writeToDataStore(todoList.toText());
    res.json(todoList.allTodo);
  }
  next();
};

const updateTaskStatus = (req, res, next) => {
  const {todoId, taskId} = req.body;
  if (todoId && taskId) {
    todoList.updateTaskStatus(todoId, taskId);
    writeToDataStore(todoList.toText());
    res.json(todoList.allTodo);
  }
  next();
};
const saveNewTodo = (req, res, next) => {
  const {title, tasks} = req.body;
  if (title && tasks) {
    todoList.addTodo(title, tasks);
    writeToDataStore(todoList.toText());
    res.json(todoList.allTodo);
  }
  next();
};

const serveTodoList = (req, res) => {
  res.json(todoList.allTodo);
};

const serveHomePage = (req, res) => res.redirect('index.html');

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));
app.get('/', serveHomePage);
app.get('/getTodoList', serveTodoList);

app.post('/saveTodo', saveNewTodo);
app.post('/updateTaskStatus', updateTaskStatus);
app.post('/deleteTodo', deleteTodo);
app.post('/insertTask', insertTask);
app.post('/deleteTask', deleteTask);
app.post('/editTitle', editTitle);
app.post('/editTask', editTask);

module.exports = {app};
