const { instanceOf, deepStrictEqual } = require('chai').assert;
const { Todo } = require('../lib/todo');

describe('TODO class', () => {
  let timeStamp;
  beforeEach(() => {
    timeStamp = new Date().getTime();
  });
  describe('createNewTodo', () => {
    it('should return an instance of Todo', () => {
      const todo = Todo.createNewTodo({
        id: 1,
        title: 'abc',
        tasks: [{ id: '1-1', status: false, content: 'abc' }],
        timeStamp
      });
      instanceOf(todo, Todo);
    });
  });

  describe('generateId', () => {
    it('should generate id for new task depending on the last task id', () => {
      const todo = Todo.createNewTodo({
        id: 1,
        title: 'abc',
        tasks: [{ id: '1-1', status: false, content: 'abc' }],
        timeStamp
      });
      deepStrictEqual(todo.generateId(), '1-2');
    });

    it('should generate id if the task list is empty', () => {
      const todo = Todo.createNewTodo({
        id: 1,
        title: 'abc',
        tasks: [],
        timeStamp
      });
      deepStrictEqual(todo.generateId(), '1-1');
    });
  });

  describe('findTask', () => {
    const todo = Todo.createNewTodo({
      id: 1,
      title: 'abc',
      tasks: [{ id: '1-1', status: false, content: 'abc' }],
      timeStamp
    });

    it('should find a task matching to the given id', () => {
      const task = { id: '1-1', status: false, content: 'abc' };
      deepStrictEqual(todo.findTask('1-1'), task);
    });

    it('should give undefined if the id does not match with any task', () => {
      deepStrictEqual(todo.findTask('1-2'));
    });
  });

  describe('updateTaskStatus', () => {
    it('should change the status to true if it is false', () => {
      const todo = Todo.createNewTodo({
        id: 1,
        title: 'abc',
        tasks: [{ id: '1-1', status: false, content: 'abc' }],
        timeStamp
      });
      const updatedTodo = Todo.createNewTodo({
        id: 1,
        title: 'abc',
        tasks: [{ id: '1-1', status: true, content: 'abc' }],
        timeStamp
      });
      todo.updateTaskStatus('1-1');
      deepStrictEqual(todo, updatedTodo);
    });
    it('should change the status to false if it is true', () => {
      const todo = Todo.createNewTodo({
        id: 1,
        title: 'abc',
        tasks: [{ id: '1-1', status: true, content: 'abc' }],
        timeStamp
      });
      const updatedTodo = Todo.createNewTodo({
        id: 1,
        title: 'abc',
        tasks: [{ id: '1-1', status: false, content: 'abc' }],
        timeStamp
      });
      todo.updateTaskStatus('1-1');
      deepStrictEqual(todo, updatedTodo);
    });
  });

  describe('insertTask', () => {
    it('should insert the given task to task list', function() {
      const todo = Todo.createNewTodo({
        id: 1,
        title: 'abc',
        tasks: [{ id: '1-1', status: false, content: 'abc' }],
        timeStamp
      });
      const updatedTodo = Todo.createNewTodo({
        id: 1,
        title: 'abc',
        tasks: [
          { id: '1-1', status: false, content: 'abc' },
          { id: '1-2', status: false, content: 'abc' }
        ],
        timeStamp
      });
      todo.insertTask('abc');
      deepStrictEqual(todo, updatedTodo);
    });
  });

  describe('deleteTask', () => {
    it('should remove the task matching to the given Id', () => {
      const todo = Todo.createNewTodo({
        id: 1,
        title: 'abc',
        tasks: [
          { id: '1-1', status: false, content: 'abc' },
          { id: '1-2', status: false, content: 'abc' }
        ],
        timeStamp
      });
      const updatedTodo = Todo.createNewTodo({
        id: 1,
        title: 'abc',
        tasks: [{ id: '1-1', status: false, content: 'abc' }],
        timeStamp
      });
      todo.deleteTask('1-2');
      deepStrictEqual(todo, updatedTodo);
    });
  });

  describe('editTitle', () => {
    it('should change the title of the todo', () => {
      const todo = Todo.createNewTodo({
        id: 1,
        title: 'abc',
        tasks: [{ id: '1-1', status: false, content: 'abc' }],
        timeStamp
      });
      const updatedTodo = Todo.createNewTodo({
        id: 1,
        title: 'hello',
        tasks: [{ id: '1-1', status: false, content: 'abc' }],
        timeStamp
      });
      todo.editTitle('hello');
      deepStrictEqual(todo, updatedTodo);
    });
  });

  describe('editTask', () => {
    it('should change matching task of  the todo', () => {
      const todo = Todo.createNewTodo({
        id: 1,
        title: 'abc',
        tasks: [{ id: '1-1', status: false, content: 'abc' }],
        timeStamp
      });
      const updatedTodo = Todo.createNewTodo({
        id: 1,
        title: 'abc',
        tasks: [{ id: '1-1', status: false, content: 'bye' }],
        timeStamp
      });
      todo.editTask('1-1', 'bye');
      deepStrictEqual(todo, updatedTodo);
    });
  });
});
