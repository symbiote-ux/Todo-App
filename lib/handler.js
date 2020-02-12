const { App } = require('./app');
const CONTENT_TYPES = require('./mimeTypes');
const STATIC_FOLDER = `${__dirname}/../public`;
const statusCodes = require('http').STATUS_CODES;
const { TodoList } = require('./todoList');
const {
  loadDataStoreContents,
  writeToDataStore,
  isPathValid,
  readFileSync
} = require('./fileOperations');

const todoList = TodoList.load(loadDataStoreContents());

const serveTodoListsData = (req, res) => {
  const contents = todoList.toText();
  res.writeHead('200', {
    'Content-Type': 'application/json',
    'Content-length': contents.length
  });
  res.end(contents);
};

const updateAndServeTodoList = (req, res) => {
  writeToDataStore(todoList.toText());
  serveTodoListsData(req, res);
};

const updateDatabase = (req, res, next) => {
  res.setHeader('Content-Type', CONTENT_TYPES.txt);
  const { title, tasks } = JSON.parse(req.body);
  if (title && tasks) {
    todoList.addTodo(title, tasks);
    return updateAndServeTodoList(req, res);
  }
  next();
};

const deleteTodo = (req, res, next) => {
  const { todoId } = JSON.parse(req.body);
  if (todoId) {
    todoList.deleteTodo(todoId);
    return updateAndServeTodoList(req, res);
  }
  next();
};

const updateTaskStatus = (req, res, next) => {
  const { todoId, taskId } = JSON.parse(req.body);
  if (todoId && taskId) {
    todoList.updateTaskStatus(todoId, taskId);
    return updateAndServeTodoList(req, res);
  }
  next();
};

const insertTask = (req, res, next) => {
  const { todoId, taskContent } = JSON.parse(req.body);
  if (todoId && taskContent) {
    todoList.insertTask(todoId, taskContent);
    return updateAndServeTodoList(req, res);
  }
  next();
};

const deleteTask = (req, res, next) => {
  const { todoId, taskId } = JSON.parse(req.body);
  if (todoId && taskId) {
    todoList.deleteTask(todoId, taskId);
    return updateAndServeTodoList(req, res);
  }
  next();
};

const isHomePath = path => path === '/';

const serveStaticFile = (req, res, next) => {
  if (isHomePath(req.url)) {
    req.url = '/index.html';
  }
  const path = `${STATIC_FOLDER}${req.url}`;
  if (isPathValid(path)) {
    return next();
  }
  const [, extension] = path.match(/.*\.(.*)$/);
  res.setHeader('Content-Type', CONTENT_TYPES[extension]);
  res.end(readFileSync(path));
};

const pageNotFound = function(req, res) {
  res.writeHead('404', {
    'Content-Type': CONTENT_TYPES.txt
  });
  res.end(statusCodes['404']);
};

const methodNotAllowed = function(req, res) {
  res.writeHead('400', { 'Content-Type': CONTENT_TYPES.txt });
  res.end(statusCodes['400']);
};

const readBody = function(req, res, next) {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    req.body = data;
    next();
  });
};

const app = new App();
app.use(readBody);
app.get('', serveStaticFile);
app.get('/getTodoLists', serveTodoListsData);
app.get('', pageNotFound);
app.post('/saveTodo', updateDatabase);
app.post('/updateTaskStatus', updateTaskStatus);
app.post('/deleteTodo', deleteTodo);
app.post('/insertTask', insertTask);
app.post('/deleteTask', deleteTask);
app.post('', pageNotFound);
app.use(methodNotAllowed);

module.exports = { app };
