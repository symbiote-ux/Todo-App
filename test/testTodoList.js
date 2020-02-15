const { instanceOf, deepStrictEqual } = require('chai').assert;
const { TodoList } = require('../lib/todoList');
const { Todo } = require('../lib/todo');

describe('TodoList Class', () => {
  let timeStamp;
  beforeEach(() => {
    timeStamp = new Date().getTime();
  });
  describe('load', () => {
    it('should generate an instance of TodoList class on static method', () => {
      const todoList = TodoList.load([
        { id: 1, title: 'abc', tasks: [], timeStamp }
      ]);
      instanceOf(todoList, TodoList);
    });
  });
});
