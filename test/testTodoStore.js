const { instanceOf, deepStrictEqual } = require('chai').assert;
const { TodoStore } = require('../lib/todoStore');
const { TodoList } = require('../lib/todoList');
const { Todo } = require('../lib/todo');
const { endRedisConnection } = require('../lib/dbOperations');

describe('TodoStore Class', () => {
  after(() => endRedisConnection());
  let timeStamp;
  beforeEach(() => {
    timeStamp = new Date().getTime();
  });
  describe('load', () => {
    it('should return an instance of TodoStore on static method', () => {
      const todoStore = TodoStore.load({});
      instanceOf(todoStore, TodoStore);
    });
  });

  describe('addUser', () => {
    it('should add a user with empty todoList', () => {
      const todoStore = TodoStore.load({});
      todoStore.addUser('user1');
      const expectedTodoStore = TodoStore.load({ user1: [] });
      deepStrictEqual(todoStore, expectedTodoStore);
    });
  });

  describe('allTodo', () => {
    it('should return the list of all todo of the matching user', () => {
      const todoStore = TodoStore.load({
        user1: [
          {
            id: 1,
            title: 'aaa',
            tasks: [{ id: '1-1', content: 'aaaa', status: false }],
            timeStamp
          },
          {
            id: 2,
            title: 'bbb',
            tasks: [{ id: '2-1', content: 'bbbb', status: false }],
            timeStamp
          }
        ]
      });
      const expected = [
        Todo.createNewTodo({
          id: 1,
          title: 'aaa',
          tasks: [{ id: '1-1', content: 'aaaa', status: false }],
          timeStamp
        }),
        Todo.createNewTodo({
          id: 2,
          title: 'bbb',
          tasks: [{ id: '2-1', content: 'bbbb', status: false }],
          timeStamp
        })
      ];
      deepStrictEqual(todoStore.allTodo('user1'), expected);
    });
  });

  describe('allTodoList', () => {
    it('should give all the todoList', () => {
      const todoStore = TodoStore.load({
        user1: [
          {
            id: 1,
            title: 'abc',
            tasks: [
              { id: '1-1', content: 'abc', status: false },
              { id: '1-2', content: 'def', status: false }
            ],
            timeStamp
          }
        ],
        user2: [
          {
            id: 3,
            title: 'def',
            tasks: [{ id: '3-1', status: false, content: 'ghi' }],
            timeStamp
          }
        ]
      });
      const expected = {
        user1: [
          {
            id: 1,
            title: 'abc',
            tasks: [
              { id: '1-1', content: 'abc', status: false },
              { id: '1-2', content: 'def', status: false }
            ],
            timeStamp
          }
        ],
        user2: [
          {
            id: 3,
            title: 'def',
            tasks: [{ id: '3-1', status: false, content: 'ghi' }],
            timeStamp
          }
        ]
      };
      deepStrictEqual(todoStore.allTodoList, expected);
    });
  });
});
