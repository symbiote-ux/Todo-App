const { App } = require('./app');
const querystring = require('querystring');
const CONTENT_TYPES = require('./mimeTypes');
const STATIC_FOLDER = `${__dirname}/../public`;
const statusCodes = { badRequest: 400, notFound: 404, redirecting: 303 };
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
  res.setHeader('Content-length', contents.length);
  res.end(contents);
};

const updateDatabase = (req, res) => {
  res.setHeader('Content-Type', CONTENT_TYPES.txt);
  const { title, tasks } = querystring.parse(req.body);
  todoList.addTodo(title, tasks);
  writeToDataStore(todoList.toText());
  res.setHeader('Content-length', todoList.toText().length);
  res.end(todoList.toText());
};

const deleteTodo = (req, res) => {
  todoList.deleteTodo(req.body);
  const updatedContentText = todoList.toText();
  writeToDataStore(updatedContentText);
  res.setHeader('Content-length', updatedContentText.length);
  res.end(updatedContentText);
};

const updateTaskStatus = (req, res) => {
  const [, todoId, subId] = req.body.split('-');
  todoList.updateTaskStatus(todoId, `${todoId}-${subId}`);
  writeToDataStore(todoList.toText());
  res.end(todoList.toText());
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

const notFound = function(req, res) {
  res.setHeader('Content-Type', CONTENT_TYPES.txt);
  res.statusCode = statusCodes.notFound;
  res.end('notFound');
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
app.get('', notFound);
app.post('/saveToDo', updateDatabase);
app.post('/updateTaskStatus', updateTaskStatus);
app.post('/deleteTodo', deleteTodo);
app.post('', notFound);
app.use(methodNotAllowed);

module.exports = { app };
