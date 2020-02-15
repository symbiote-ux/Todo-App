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

  describe('getAllTodo', () => {
    it('should give all todo in an array format', () => {
      const todoList = TodoList.load([
        {
          id: 1,
          title: 'abc',
          tasks: [{ id: '1-1', status: false, content: 'def' }],
          timeStamp
        },
        { id: 2, title: 'xyz', tasks: [], timeStamp }
      ]);
      deepStrictEqual(todoList.allTodo, todoList.todoList);
    });
  });
});
