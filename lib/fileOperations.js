const { writeFile, existsSync, readFileSync } = require('fs');
const config = require('../config');
const TODO_STORE = config.DATA_STORE || `${__dirname}/../dataStore/todo.json`;
const USER_ID_STORE = `${__dirname}/../dataStore/userId.json`;

const loadDataStoreContents = () =>
  existsSync(TODO_STORE) ? JSON.parse(readFileSync(TODO_STORE, 'utf8')) : [];

const writeToDataStore = contents => writeFile(TODO_STORE, contents, () => {});

const loadUserIdStoreContents = () =>
  existsSync(USER_ID_STORE)
    ? JSON.parse(readFileSync(USER_ID_STORE, 'utf8'))
    : [];

const writeToUserIdStore = userData =>
  writeFile(USER_ID_STORE, userData, () => {});

module.exports = {
  loadDataStoreContents,
  writeToDataStore,
  loadUserIdStoreContents,
  writeToUserIdStore
};
