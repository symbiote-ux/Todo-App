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
    const previousId = this.tasks[noOfTasks - one]
      ? this.tasks[noOfTasks - one].id
      : `${this.id}-0`;
    const [todoId, taskId] = previousId.split('-');
    return `${todoId}-${+taskId + one}`;
  }

  findTask(taskId) {
    return this.tasks.find(task => task.id === taskId);
  }

  updateTaskStatus(taskId) {
    const task = this.findTask(taskId);
    task.status = !task.status;
  }

  insertTask(content) {
    this.tasks.push({ id: this.generateId(), content, status: false });
  }

  deleteTask(taskId) {
    const one = 1;
    const matchingTask = this.findTask(taskId);
    const taskPosition = this.tasks.indexOf(matchingTask);
    this.tasks.splice(taskPosition, one);
  }

  editTitle(title) {
    this.title = title;
  }

  editTask(taskId, task) {
    const matchingTask = this.findTask(taskId);
    matchingTask.content = task;
  }
}

module.exports = { Todo };
