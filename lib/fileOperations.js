const { existsSync, readFileSync, writeFileSync, statSync } = require('fs');
const config = require('../config');
const TODO_STORE = config.DATA_STORE || `${__dirname}/../dataStore/todo.json`;

const loadDataStoreContents = () =>
  existsSync(TODO_STORE) ? JSON.parse(readFileSync(TODO_STORE, 'utf8')) : [];

const writeToDataStore = contents => writeFileSync(TODO_STORE, contents);

const isPathValid = path => {
  const stat = existsSync(path) && statSync(path);
  return !stat || !stat.isFile();
};

module.exports = {
  loadDataStoreContents,
  writeToDataStore,
  isPathValid,
  readFileSync
};
