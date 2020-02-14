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
});
