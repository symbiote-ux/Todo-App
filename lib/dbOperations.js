const redis = require('redis');
const { TodoStore } = require('./todoStore');
const client = redis.createClient();

const loadUserIdStore = app =>
  client.get('USER_ID_STORE', (error, res) => {
    app.locals.userCredentials = res ? JSON.parse(res) : [];
  });

const loadTodoStore = app =>
  client.get('TODO_STORE', (error, res) => {
    app.locals.allUserData = TodoStore.load(res ? JSON.parse(res) : {});
  });

const writeToStore = (path, data) => client.set(path, JSON.stringify(data));

const writeToTodoStore = writeToStore.bind(null, 'TODO_STORE');

const writeToUserIdStore = writeToStore.bind(null, 'USER_ID_STORE');

const endRedisConnection = () => client.end(true);

module.exports = {
  loadUserIdStore,
  loadTodoStore,
  writeToUserIdStore,
  writeToTodoStore,
  endRedisConnection
};
