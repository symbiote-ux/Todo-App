const { readFileSync, existsSync, statSync, writeFileSync } = require('fs');
const { App } = require('./app');
const querystring = require('querystring');
const CONTENT_TYPES = require('./mimeTypes');
const STATIC_FOLDER = `${__dirname}/../public`;
const statusCodes = { badRequest: 400, notFound: 404, redirecting: 303 };
const config = require('../config');
const TODO_STORE = config.DATA_STORE || `${__dirname}/../dataStore/todo.json`;

const getPreviousContents = TODO_STORE =>
  existsSync(TODO_STORE) ? JSON.parse(readFileSync(TODO_STORE, 'utf8')) : [];

const getContentsAndId = () => {
  const contents = getPreviousContents(TODO_STORE);
  const [lastElement] = contents.slice(-1);
  const id = lastElement ? lastElement.id + 1 : 1;
  return { contents, id };
};

const updateDatabase = (req, res) => {
  res.setHeader('Content-Type', CONTENT_TYPES.txt);
  const { title, tasks } = querystring.parse(req.body);
  const { contents, id } = getContentsAndId();
  const timeStamp = new Date().getTime();
  contents.push({ id, title, tasks: JSON.parse(tasks), timeStamp });
  const updatedContentText = JSON.stringify(contents);
  writeFileSync(TODO_STORE, updatedContentText);
  res.setHeader('Content-length', updatedContentText.length);
  res.end(updatedContentText);
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

const isPathValid = path => {
  const stat = existsSync(path) && statSync(path);
  return !stat || !stat.isFile();
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

const serveTodoListsData = (req, res) => {
  const contents = JSON.stringify(getPreviousContents(TODO_STORE));
  res.setHeader('Content-length', contents.length);
  res.end(contents);
};

const deleteTodo = (req, res) => {
  const contents = getPreviousContents(TODO_STORE);
  const updatedContents = contents.filter(todo => todo.id !== +req.body);
  const updatedContentText = JSON.stringify(updatedContents);
  writeFileSync(TODO_STORE, updatedContentText);
  res.setHeader('Content-length', updatedContentText.length);
  res.end(updatedContentText);
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
app.post('/saveToDo', updateDatabase);
app.post('/deleteTodo', deleteTodo);
app.get('', notFound);
app.post('', notFound);
app.use(methodNotAllowed);

module.exports = { app };
