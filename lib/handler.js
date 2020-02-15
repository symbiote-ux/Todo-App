const express = require('express');
const { TodoList } = require('./todoList');
const {
  loadDataStoreContents,
  writeToDataStore,
  loadUserIdStoreContents,
  writeToUserIdStore
} = require('./fileOperations');
const todoList = TodoList.load(loadDataStoreContents());
const statusCodes = {
  ok: 200,
  unauthorized: 401,
  conflict: 409
};

const editTask = (req, res, next) => {
  const { todoId, taskId, task } = req.body;
  if (todoId && taskId && task) {
    todoList.editTask(todoId, taskId, task);
    writeToDataStore(todoList.toText());
    res.json(todoList.allTodo);
  }
  next();
};

const editTitle = (req, res, next) => {
  const { todoId, title } = req.body;
  if (todoId && title) {
    todoList.editTitle(todoId, title);
    writeToDataStore(todoList.toText());
    res.json(todoList.allTodo);
  }
  next();
};

const deleteTask = (req, res, next) => {
  const { todoId, taskId } = req.body;
  if (todoId && taskId) {
    todoList.deleteTask(todoId, taskId);
    writeToDataStore(todoList.toText());
    res.json(todoList.allTodo);
  }
  next();
};

const insertTask = (req, res, next) => {
  const { todoId, taskContent } = req.body;
  if (todoId && taskContent) {
    todoList.insertTask(todoId, taskContent);
    writeToDataStore(todoList.toText());
    res.json(todoList.allTodo);
  }
  next();
};

const deleteTodo = (req, res, next) => {
  const { todoId } = req.body;
  if (todoId) {
    todoList.deleteTodo(todoId);
    writeToDataStore(todoList.toText());
    res.json(todoList.allTodo);
  }
  next();
};

const updateTaskStatus = (req, res, next) => {
  const { todoId, taskId } = req.body;
  if (todoId && taskId) {
    todoList.updateTaskStatus(todoId, taskId);
    writeToDataStore(todoList.toText());
    res.json(todoList.allTodo);
  }
  next();
};
const saveNewTodo = (req, res, next) => {
  const { title, tasks } = req.body;
  if (title && tasks) {
    const timeStamp = new Date().getTime();
    todoList.addTodo(title, tasks, timeStamp);
    writeToDataStore(todoList.toText());
    res.json(todoList.allTodo);
  }
  next();
};

const serveTodoList = (req, res) => {
  res.json(todoList.allTodo);
};

const serveLoginPage = (req, res) => res.redirect('login.html');

const signUp = (req, res) => {
  const allUserData = loadUserIdStoreContents();
  const matchedUser = allUserData.find(
    user => user.userName === req.body.userName
  );
  if (matchedUser) {
    res.sendStatus(statusCodes.conflict);
  } else {
    allUserData.push(req.body);
    writeToUserIdStore(JSON.stringify(allUserData));
    res.sendStatus(statusCodes.ok);
  }
};

const login = (req, res) => {
  const allUserData = loadUserIdStoreContents();
  const { userName, password } = req.body;
  const matchedUser = allUserData.find(
    user => user.userName === userName && user.password === password
  );
  if (matchedUser) {
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
