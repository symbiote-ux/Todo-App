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

  generateId() {
    const one = 1;
    const noOfTasks = this.tasks.length;
    const previousId = this.tasks[noOfTasks]
      ? this.tasks[noOfTasks].id
      : `${this.id}-${one}`;
    const [todoId, taskId] = previousId.split('-');
    return `${todoId}-${+taskId + one}`;
  }

  updateTaskStatus(taskId) {
    const matchingTask = this.tasks.find(task => task.id === taskId);
    matchingTask.status = !matchingTask.status;
  }

  insertTask(content) {
    this.tasks.push({ id: this.generateId(), content, status: false });
  }

  deleteTask(taskId) {
    const one = 1;
    const matchingTask = this.tasks.find(task => task.id === taskId);
    const taskPosition = this.tasks.indexOf(matchingTask);
    this.tasks.splice(taskPosition, one);
  }
}

module.exports = { Todo };
