const { writeFile, existsSync, readFileSync } = require('fs');
const config = require('../config');
const TODO_STORE = config.DATA_STORE || `${__dirname}/../dataStore/todo.json`;
const USER_ID_STORE = `${__dirname}/../dataStore/userId.json`;

const loadTodoStore = () =>
  existsSync(TODO_STORE) ? JSON.parse(readFileSync(TODO_STORE, 'utf8')) : {};

const loadUserIdStore = () =>
  existsSync(USER_ID_STORE)
    ? JSON.parse(readFileSync(USER_ID_STORE, 'utf8'))
    : [];

const writeToStore = (path, data) =>
  writeFile(path, JSON.stringify(data), () => {});

const writeToTodoStore = writeToStore.bind(null, TODO_STORE);

const writeToUserIdStore = writeToStore.bind(null, USER_ID_STORE);

module.exports = {
  loadUserIdStore,
  loadTodoStore,
  writeToUserIdStore,
  writeToTodoStore
};
