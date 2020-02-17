const { TodoList } = require('./todoList');

class TodoStore {
  constructor() {
    this.allUsers = {};
  }

  static load(allTodoList) {
    const todoStore = new TodoStore();
    for (const user in allTodoList) {
      todoStore.allUsers[user] = TodoList.load(allTodoList[user]);
    }
    return todoStore;
  }
  addUser(userName) {
    this.allUsers[userName] = TodoList.load([]);
  }
  allTodo(userName) {
    this.allUsers[userName].allTodo;
  }
  get allTodoList() {
    const allTodoList = {};
    for (const user in this.allUsers) {
      allTodoList[user] = this.allTodo(user);
    }
    return allTodoList;
  }
  editTask(userName, todoId, taskId, task) {
    this.allUsers[userName].editTask(todoId, taskId, task);
  }
  editTitle(userName, todoId, title) {
    this.allUsers[userName].editTitle(todoId, title);
  }
  deleteTask(userName, todoId, taskId) {
    this.allUsers[userName].deleteTask(todoId, taskId);
  }
  insertTask(userName, todoId, taskContent) {
    this.allUsers[userName].insertTask(todoId, taskContent);
  }
  deleteTodo(userName, todoId) {
    this.allUsers[userName].deleteTodo(todoId);
  }
  updateTaskStatus(userName, todoId, taskId) {
    this.allUsers[userName].updateTaskStatus(todoId, taskId);
  }
  saveNewTodo(userName, title, tasks, timeStamp) {
    this.allUsers[userName].saveNewTodo(title, tasks, timeStamp);
  }
}

module.exports = { TodoStore };
