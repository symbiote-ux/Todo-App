const { writeFile, existsSync, readFileSync } = require('fs');
const config = require('../config');
const TODO_STORE = config.DATA_STORE || `${__dirname}/../dataStore/todo.json`;
const USER_ID_STORE = `${__dirname}/../dataStore/userId.json`;

const loadStore = path =>
  existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : {};

const writeToStore = (path, content) =>
  writeFile(path, JSON.stringify(content), () => {});

const writeToTodoStore = allTodoList => {
  const dataToWrite = {};
  for (const user in allTodoList) {
    dataToWrite[user] = allTodoList[user].allTodo;
  }
  writeToStore(TODO_STORE, dataToWrite);
};

const loadTodoStore = loadStore.bind(null, TODO_STORE);
const loadUserIdStore = loadStore.bind(null, USER_ID_STORE);

const writeToUserIdStore = writeToStore.bind(null, USER_ID_STORE);

module.exports = {
  loadUserIdStore,
  loadTodoStore,
  writeToUserIdStore,
  writeToTodoStore
};
