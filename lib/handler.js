const { App } = require('./app');
const querystring = require('querystring');
const CONTENT_TYPES = require('./mimeTypes');
const STATIC_FOLDER = `${__dirname}/../public`;
const statusCodes = {
  ok: 200,
  badRequest: 400,
  notFound: 404,
  redirecting: 303
};
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
  res.writeHead(statusCodes.ok, {
    'Content-Type': 'application/json',
    'Content-length': contents.length
  });
  res.end(contents);
};

const updateAndServeTodoList = (req, res) => {
  writeToDataStore(todoList.toText());
  serveTodoListsData(req, res);
};

const updateDatabase = (req, res) => {
  res.setHeader('Content-Type', CONTENT_TYPES.txt);
  const { title, tasks } = querystring.parse(req.body);
  todoList.addTodo(title, tasks);
  updateAndServeTodoList(req, res);
};

const deleteTodo = (req, res) => {
  todoList.deleteTodo(req.body);
  updateAndServeTodoList(req, res);
};

const updateTaskStatus = (req, res) => {
  const [, todoId, subId] = req.body.split('-');
  todoList.updateTaskStatus(todoId, `${todoId}-${subId}`);
  updateAndServeTodoList(req, res);
};

const insertTask = (req, res) => {
  const [todoId, taskContent] = req.body.split('-');
  todoList.insertTask(todoId, taskContent);
  updateAndServeTodoList(req, res);
};

const deleteTask = (req, res) => {
  const [, , todoId, subId] = req.body.split('-');
  todoList.deleteTask(todoId, `${todoId}-${subId}`);
  updateAndServeTodoList(req, res);
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
  res.writeHead(statusCodes.notFound, {
    'Content-Type': CONTENT_TYPES.txt
  });
  res.end('pageNotFound');
};

const methodNotAllowed = function(req, res) {
  res.setHeader('Content-Type', CONTENT_TYPES.txt);
  res.statusCode = statusCodes.badRequest;
  res.end('badRequest');
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
