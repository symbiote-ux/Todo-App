const { writeToUserIdStore, writeToTodoStore } = require('./fileOperations');
const { TodoList } = require('./todoList');

const editTask = (req, res, next) => {
  const { todoId, taskId, task } = req.body;
  if (todoId && taskId && task) {
    const { SID } = req.cookies;
    const { allUserData, userSessions } = req.app.locals;
    const userName = userSessions[SID];
    allUserData[userName].editTask(todoId, taskId, task);
    writeToTodoStore(allUserData);
    res.json(allUserData[userName].allTodo);
  }
  next();
};

const editTitle = (req, res, next) => {
  const { todoId, title } = req.body;
  if (todoId && title) {
    const { SID } = req.cookies;
    const { allUserData, userSessions } = req.app.locals;
    const userName = userSessions[SID];
    allUserData[userName].editTitle(todoId, title);
    writeToTodoStore(allUserData);
    res.json(allUserData[userName].allTodo);
  }
  next();
};

const deleteTask = (req, res, next) => {
  const { todoId, taskId } = req.body;
  if (todoId && taskId) {
    const { SID } = req.cookies;
    const { allUserData, userSessions } = req.app.locals;
    const userName = userSessions[SID];
    allUserData[userName].deleteTask(todoId, taskId);
    writeToTodoStore(allUserData);
    res.json(allUserData[userName].allTodo);
  }
  next();
};

const insertTask = (req, res, next) => {
  const { todoId, taskContent } = req.body;
  if (todoId && taskContent) {
    const { SID } = req.cookies;
    const { allUserData, userSessions } = req.app.locals;
    const userName = userSessions[SID];
    allUserData[userName].insertTask(todoId, taskContent);
    writeToTodoStore(allUserData);
    res.json(allUserData[userName].allTodo);
  }
  next();
};

const deleteTodo = (req, res, next) => {
  const { todoId } = req.body;
  if (todoId) {
    const { SID } = req.cookies;
    const { allUserData, userSessions } = req.app.locals;
    const userName = userSessions[SID];
    allUserData[userName].deleteTodo(todoId);
    writeToTodoStore(allUserData);
    res.json(allUserData[userName].allTodo);
  }
  next();
};

const updateTaskStatus = (req, res, next) => {
  const { todoId, taskId } = req.body;
  if (todoId && taskId) {
    const { SID } = req.cookies;
    const { allUserData, userSessions } = req.app.locals;
    const userName = userSessions[SID];
    allUserData[userName].updateTaskStatus(todoId, taskId);
    writeToTodoStore(allUserData);
    res.json(allUserData[userName].allTodo);
  }
  next();
};

const saveNewTodo = (req, res, next) => {
  const { title, tasks } = req.body;
  if (title && tasks) {
    const timeStamp = new Date().getTime();
    const { SID } = req.cookies;
    const { allUserData, userSessions } = req.app.locals;
    const userName = userSessions[SID];
    allUserData[userName].addTodo(title, tasks, timeStamp);
    writeToTodoStore(allUserData);
    res.json(allUserData[userName].allTodo);
  }
  next();
};

const serveTodoList = (req, res) => {
  const { SID } = req.cookies;
  const { allUserData, userSessions } = req.app.locals;
  const userName = userSessions[SID];
  res.json(allUserData[userName].allTodo);
};

const serveHomePath = (req, res) => res.redirect(getHomePath(req));

const statusCodes = {
  ok: 200,
  unauthorized: 401,
  conflict: 409
};

const signUp = (req, res) => {
  const { allUserData, userCredentials } = req.app.locals;
  const { userName, password } = req.body;
  if (allUserData[userName]) {
    res.sendStatus(statusCodes.conflict);
  } else {
    allUserData[userName] = TodoList.load([]);
    userCredentials[userName] = password;
    writeToTodoStore(allUserData);
    writeToUserIdStore(userCredentials);
    res.sendStatus(statusCodes.ok);
  }
};

const isUserAuthorized = (userCredentials, userName, password) =>
  userCredentials[userName] && userCredentials[userName] === password;

const generateSessionId = userSessions => {
  const one = 1;
  const sessionIds = Object.keys(userSessions).sort();
  const lastId = sessionIds.pop();
  return lastId ? +lastId + one : one;
};

const login = (req, res) => {
  const { userCredentials, userSessions } = req.app.locals;
  const { userName, password } = req.body;
  if (isUserAuthorized(userCredentials, userName, password)) {
    const sessionId = generateSessionId(userSessions);
    req.app.locals.userSessions[sessionId] = userName;
    res.setHeader('Set-Cookie', `SID=${sessionId}`);
    res.redirect('/index.html');
  } else {
    res.sendStatus(statusCodes.unauthorized);
  }
};

const loadAllTodoList = allUserData => {
  const allTodoList = {};
  for (const user in allUserData) {
    allTodoList[user] = TodoList.load(allUserData[user]);
  }
  return allTodoList;
};

const getHomePath = req => {
  const { SID } = req.cookies;
  const { userSessions } = req.app.locals;
  return userSessions[SID] ? 'index.html' : 'login.html';
};

module.exports = {
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
  serveHomePath,
  loadAllTodoList
};
