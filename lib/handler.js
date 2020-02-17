const { writeToUserIdStore, writeToTodoStore } = require('./fileOperations');

const editTask = (req, res, next) => {
  const { todoId, taskId, task } = req.body;
  if (todoId && taskId && task) {
    const { SID } = req.cookies;
    const { allUserData, userSessions } = req.app.locals;
    const userName = userSessions[SID];
    allUserData.editTask(userName, todoId, taskId, task);
    writeToTodoStore(allUserData.allTodoList);
    res.json(allUserData.allTodo(userName));
  }
  next();
};

const editTitle = (req, res, next) => {
  const { todoId, title } = req.body;
  if (todoId && title) {
    const { SID } = req.cookies;
    const { allUserData, userSessions } = req.app.locals;
    const userName = userSessions[SID];
    allUserData.editTitle(userName, todoId, title);
    writeToTodoStore(allUserData.allTodoList);
    res.json(allUserData.allTodo(userName));
  }
  next();
};

const deleteTask = (req, res, next) => {
  const { todoId, taskId } = req.body;
  if (todoId && taskId) {
    const { SID } = req.cookies;
    const { allUserData, userSessions } = req.app.locals;
    const userName = userSessions[SID];
    allUserData.deleteTask(userName, todoId, taskId);
    writeToTodoStore(allUserData.allTodoList);
    res.json(allUserData.allTodo(userName));
  }
  next();
};

const insertTask = (req, res, next) => {
  const { todoId, taskContent } = req.body;
  if (todoId && taskContent) {
    const { SID } = req.cookies;
    const { allUserData, userSessions } = req.app.locals;
    const userName = userSessions[SID];
    allUserData.insertTask(userName, todoId, taskContent);
    writeToTodoStore(allUserData.allTodoList);
    res.json(allUserData.allTodo(userName));
  }
  next();
};

const deleteTodo = (req, res, next) => {
  const { todoId } = req.body;
  if (todoId) {
    const { SID } = req.cookies;
    const { allUserData, userSessions } = req.app.locals;
    const userName = userSessions[SID];
    allUserData.deleteTodo(userName, todoId);
    writeToTodoStore(allUserData.allTodoList);
    res.json(allUserData.allTodo(userName));
  }
  next();
};

const updateTaskStatus = (req, res, next) => {
  const { todoId, taskId } = req.body;
  if (todoId && taskId) {
    const { SID } = req.cookies;
    const { allUserData, userSessions } = req.app.locals;
    const userName = userSessions[SID];
    allUserData.updateTaskStatus(userName, todoId, taskId);
    writeToTodoStore(allUserData.allTodoList);
    res.json(allUserData.allTodo(userName));
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
    allUserData.addTodo(userName, title, tasks, timeStamp);
    writeToTodoStore(allUserData.allTodoList);
    res.json(allUserData.allTodo(userName));
  }
  next();
};

const serveTodoList = (req, res) => {
  const { SID } = req.cookies;
  const { allUserData, userSessions } = req.app.locals;
  const userName = userSessions[SID];
  res.json(allUserData.allTodo(userName));
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
  const isUserExist = userCredentials.find(user => user.userName === userName);
  if (isUserExist) {
    res.sendStatus(statusCodes.conflict);
  } else {
    allUserData.addUser(userName);
    userCredentials.push({ userName, password });
    writeToTodoStore(allUserData.allTodoList);
    writeToUserIdStore(userCredentials);
    res.sendStatus(statusCodes.ok);
  }
};

const isUserAuthorized = (userCredentials, userName, password) => {
  const matchedUser = userCredentials.find(user => user.userName === userName);
  return matchedUser && matchedUser.password === password;
};

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
    res.send();
  } else {
    res.sendStatus(statusCodes.unauthorized);
  }
};

const getHomePath = req => {
  const { SID } = req.cookies;
  const { userSessions } = req.app.locals;
  return userSessions[SID] ? 'index.html' : 'homePage.html';
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
  serveHomePath
};
