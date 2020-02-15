const { writeFile, existsSync, readFileSync } = require('fs');
const USER_ID_STORE = `${__dirname}/../dataStore/userId.json`;

const loadUserIdStore = () =>
  existsSync(USER_ID_STORE)
    ? JSON.parse(readFileSync(USER_ID_STORE, 'utf8'))
    : [];

const writeToUserIdStore = userData =>
  writeFile(USER_ID_STORE, userData, () => {});

module.exports = { loadUserIdStore, writeToUserIdStore };
