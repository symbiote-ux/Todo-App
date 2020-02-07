class Todo {
  constructor(id, title, tasks, timeStamp) {
    this.id = id;
    this.title = title;
    this.tasks = tasks;
    this.timeStamp = timeStamp;
  }

  static createNewTodo({ id, title, tasks }) {
    const timeStamp = new Date().getTime();
    return new Todo(id, title, tasks, timeStamp);
  }

  updateTaskStatus(taskId) {
    const matchingTask = this.tasks.find(task => task.id === taskId);
    matchingTask.status = !matchingTask.status;
  }
}

module.exports = { Todo };
