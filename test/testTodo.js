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
});
