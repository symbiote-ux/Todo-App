const { writeFile, existsSync, readFileSync } = require('fs');
const { TodoList } = require('./todoList');

class TodoStore {
  constructor(TODO_STORE) {
    this.TODO_STORE = TODO_STORE;
    this.allTodoList = {};
  }
  static load(TODO_STORE) {
    const allTodoData = existsSync(TODO_STORE)
      ? JSON.parse(readFileSync(TODO_STORE, 'utf8'))
      : {};
    const todoStore = new TodoStore(TODO_STORE);
    Object.keys(allTodoData).forEach(userId => {
      todoStore.allTodoList[userId] = allTodoData[userId];
    });
    return todoStore;
  }
  assignUser(userId) {
    this.currentUser = userId;
    this.currentTodoList = TodoList.load(this.allTodoList[userId]);
  }
  get allTodo() {
    return this.currentTodoList.allTodo;
  }
  editTask(todoId, taskId, task) {
    this.currentTodoList.editTask(todoId, taskId, task);
    this.store();
  }
  editTitle(todoId, title) {
    this.currentTodoList.editTitle(todoId, title);
    this.store();
  }
  deleteTask(todoId, taskId) {
    this.currentTodoList.deleteTask(todoId, taskId);
    this.store();
  }
  insertTask(todoId, taskContent) {
    this.currentTodoList.insertTask(todoId, taskContent);
    this.store();
  }
  deleteTodo(todoId) {
    this.currentTodoList.deleteTodo(todoId);
    this.store();
  }
  updateTaskStatus(todoId, taskId) {
    this.currentTodoList.updateTaskStatus(todoId, taskId);
    this.store();
  }
  addTodo(title, tasks, timeStamp) {
    this.currentTodoList.addTodo(title, tasks, timeStamp);
    this.store();
  }
  initiateUser(userId) {
    this.allTodoList[userId] = [];
    this.store();
  }
  toText() {
    return JSON.stringify(this.allTodoList);
  }
  store() {
    this.allTodoList[this.currentUser] = this.currentTodoList.allTodo;
    writeFile(this.TODO_STORE, this.toText(), () => {});
  }
}

module.exports = { TodoStore };
