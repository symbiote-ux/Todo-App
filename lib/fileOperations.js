const {writeFile, existsSync, readFileSync} = require('fs');
const config = require('../config');
const TODO_STORE = config.DATA_STORE || `${__dirname}/../dataStore/todo.json`;

const loadDataStoreContents = () =>
  existsSync(TODO_STORE) ? JSON.parse(readFileSync(TODO_STORE, 'utf8')) : [];

const writeToDataStore = contents => writeFile(TODO_STORE, contents, () => {});

module.exports = {
  loadDataStoreContents,
  writeToDataStore
};
