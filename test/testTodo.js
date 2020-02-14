const { instanceOf, deepStrictEqual } = require('chai').assert;
const { Todo } = require('../lib/todo');

describe('TODO class', () => {
  describe('createNewTodo', () => {
    it('should return an instance of Todo', () => {
      const todo = Todo.createNewTodo({
        id: 1,
        title: 'abc',
        tasks: [{ id: '1-1', status: false, content: 'abc' }]
      });
      instanceOf(todo, Todo);
    });
  });

  describe('generateId', () => {
    it('should generate id for new task depending on the last task id', () => {
      const todo = Todo.createNewTodo({
        id: 1,
        title: 'abc',
        tasks: [{ id: '1-1', status: false, content: 'abc' }]
      });
      deepStrictEqual(todo.generateId(), '1-2');
    });

    it('should generate id if the task list is empty', () => {
      const todo = Todo.createNewTodo({
        id: 1,
        title: 'abc',
        tasks: []
      });
      deepStrictEqual(todo.generateId(), '1-1');
    });
  });

  describe('findTask', () => {
    const todo = Todo.createNewTodo({
      id: 1,
      title: 'abc',
      tasks: [{ id: '1-1', status: false, content: 'abc' }]
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
        tasks: [{ id: '1-1', status: false, content: 'abc' }]
      });
      const updatedTodo = Todo.createNewTodo({
        id: 1,
        title: 'abc',
        tasks: [{ id: '1-1', status: true, content: 'abc' }]
      });
      todo.updateTaskStatus('1-1');
      deepStrictEqual(todo, updatedTodo);
    });
    it('should change the status to false if it is true', () => {
      const todo = Todo.createNewTodo({
        id: 1,
        title: 'abc',
        tasks: [{ id: '1-1', status: true, content: 'abc' }]
      });
      const updatedTodo = Todo.createNewTodo({
        id: 1,
        title: 'abc',
        tasks: [{ id: '1-1', status: false, content: 'abc' }]
      });
      todo.updateTaskStatus('1-1');
      deepStrictEqual(todo, updatedTodo);
    });
  });
});
