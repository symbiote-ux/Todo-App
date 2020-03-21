const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { loadTodoStore, loadUserIdStore } = require('./dbOperations');
const { router } = require('./router');

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
  ensureLogin,
  logOut
} = require('./handler');

const app = express();

loadTodoStore(app);
loadUserIdStore(app);
app.locals.userSessions = {};

app.use(morgan('common'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.post('/signUp', signUp);
app.post('/login', login);
app.use('/user', router);
app.use(ensureLogin);
app.get('/', (req, res) => res.redirect('/homePage.html'));
app.use(express.static('public'));

app.post('/logout', logOut);
app.get('/getTodoList', serveTodoList);
app.post('/saveTodo', saveNewTodo);
app.post('/updateTaskStatus', updateTaskStatus);
app.post('/deleteTodo', deleteTodo);
app.post('/insertTask', insertTask);
app.post('/deleteTask', deleteTask);
app.post('/editTitle', editTitle);
app.post('/editTask', editTask);

module.exports = { app };
