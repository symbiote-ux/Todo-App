const { Todo } = require('./todo');
const numbers = { zero: 0, one: 1 };

const addTaskDetails = (tasks, todoId) => {
  let taskId = numbers.zero;
  const idAddedTasks = tasks.map(task => {
    taskId++;
    const taskSet = {};
    taskSet.id = `${todoId}-${taskId}`;
    taskSet.status = false;
    taskSet.content = task;
    return taskSet;
  });
  return idAddedTasks;
};

class TodoList {
  constructor() {
    this.todoList = [];
  }

  static load(dateBaseContents) {
    const newTodoLists = new TodoList();
    dateBaseContents.forEach(({ title, tasks, id }) =>
      newTodoLists.todoList.push(Todo.createNewTodo({ title, tasks, id }))
    );
    return newTodoLists;
  }

  toText() {
    return JSON.stringify(this.todoList);
  }

  generateId() {
    const previousId = this.todoList[numbers.zero]
      ? this.todoList[numbers.zero].id
      : numbers.one;
    return previousId + numbers.one;
  }

  addTodo(title, tasks, id = this.generateId()) {
    this.todoList.unshift(
      Todo.createNewTodo({
        title,
        tasks: addTaskDetails(tasks, id),
        id
      })
    );
  }

  deleteTodo(todoId) {
    const matchingElement = this.todoList.find(todo => todo.id === +todoId);
    const todoPosition = this.todoList.indexOf(matchingElement);
    const numOne = numbers.one;
    this.todoList.splice(todoPosition, numOne);
  }

  insertTask(todoId, task) {
    const matchingTodo = this.todoList.find(todo => todo.id === +todoId);
    matchingTodo.insertTask(task);
  }

  deleteTask(todoId, taskId) {
    const matchingTodo = this.todoList.find(todo => todo.id === +todoId);
    matchingTodo.deleteTask(taskId);
  }

  updateTaskStatus(todoId, taskId) {
    const matchingTodo = this.todoList.find(todo => todo.id === +todoId);
    matchingTodo.updateTaskStatus(taskId);
  }
}

module.exports = { TodoList };
