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

  describe('toText', () => {
    it('should return the text format of the all todo', () => {
      const todoList = TodoList.load([
        {
          id: 1,
          title: 'abc',
          tasks: [{ id: '1-1', status: false, content: 'def' }],
          timeStamp
        }
      ]);
      deepStrictEqual(todoList.toText(), JSON.stringify(todoList.todoList));
    });
  });

  describe('generateId', () => {
    it('should generate id for a todo depending on the last one', () => {
      const todoList = TodoList.load([
        {
          id: 1,
          title: 'abc',
          tasks: [{ id: '1-1', status: false, content: 'def' }],
          timeStamp
        }
      ]);
      deepStrictEqual(todoList.generateId(), 2);
    });

    it('should should give id as 1 if the todoList is empty', () => {
      const todoList = TodoList.load([]);
      deepStrictEqual(todoList.generateId(), 1);
    });
  });

  describe('findTodo', () => {
    it('should find todo matching to the given id', () => {
      const todoList = TodoList.load([
        {
          id: 1,
          title: 'abc',
          tasks: [{ id: '1-1', status: false, content: 'def' }],
          timeStamp
        },
        {
          id: 2,
          title: 'pqr',
          tasks: [{ id: '2-1', status: false, content: 'xyz' }],
          timeStamp
        }
      ]);
      const expectedTodo = Todo.createNewTodo({
        id: 2,
        title: 'pqr',
        tasks: [{ id: '2-1', status: false, content: 'xyz' }],
        timeStamp
      });
      deepStrictEqual(todoList.findTodo(2), expectedTodo);
    });

    it('should give undefined if the id does not exist', () => {
      const todoList = TodoList.load([
        {
          id: 1,
          title: 'abc',
          tasks: [{ id: '1-1', status: false, content: 'def' }],
          timeStamp
        }
      ]);
      deepStrictEqual(todoList.findTodo(3));
    });
  });
});
