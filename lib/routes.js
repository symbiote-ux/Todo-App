const express = require('express');
const cookieParser = require('cookie-parser');
const { loadTodoStore, loadUserIdStore } = require('./fileOperations');
const { TodoStore } = require('./todoStore');
const {
  editTask,
  editTitle,
  deleteTask,
  insertTask,
  deleteTodo,
  updateTaskStatus,
  saveNewTodo,
  serveTodoList,
  login,
  signUp,
  serveHomePath
} = require('./handler');

const app = express();

app.locals = {
  allUserData: loadTodoStore.load(loadTodoStore()),
  userCredentials: loadUserIdStore(),
  userSessions: {}
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.get('/', serveHomePath);
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
