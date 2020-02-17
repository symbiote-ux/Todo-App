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

  describe('addTodo', () => {
    it('should add a new todo', () => {
      const todoList = TodoList.load([
        {
          id: 1,
          title: 'abc',
          tasks: [{ id: '1-1', status: false, content: 'def' }],
          timeStamp
        }
      ]);
      const expectedTodoList = TodoList.load([
        {
          id: 2,
          title: 'abc',
          tasks: [{ id: '2-1', status: false, content: 'def' }],
          timeStamp
        },
        {
          id: 1,
          title: 'abc',
          tasks: [{ id: '1-1', status: false, content: 'def' }],
          timeStamp
        }
      ]);
      todoList.addTodo('abc', ['def'], timeStamp);
      deepStrictEqual(todoList, expectedTodoList);
    });
  });

  describe('deleteTodo', () => {
    it('should delete todo matching for given todoId', () => {
      const todoList = TodoList.load([
        {
          id: 2,
          title: 'abc',
          tasks: [{ id: '2-1', status: false, content: 'def' }],
          timeStamp
        },
        {
          id: 1,
          title: 'abc',
          tasks: [{ id: '1-1', status: false, content: 'def' }],
          timeStamp
        }
      ]);
      const expectedTodoList = TodoList.load([
        {
          id: 2,
          title: 'abc',
          tasks: [{ id: '2-1', status: false, content: 'def' }],
          timeStamp
        }
      ]);
      todoList.deleteTodo(1);
      deepStrictEqual(todoList, expectedTodoList);
    });
  });

  describe('insertTask', () => {
    it('should insert new task on the matching todo', () => {
      const todoList = TodoList.load([
        {
          id: 1,
          title: 'abc',
          tasks: [{ id: '1-1', status: false, content: 'def' }],
          timeStamp
        }
      ]);
      const expectedTodoList = TodoList.load([
        {
          id: 1,
          title: 'abc',
          tasks: [
            { id: '1-1', status: false, content: 'def' },
            { id: '1-2', status: false, content: 'hij' }
          ],
          timeStamp
        }
      ]);
      todoList.insertTask(1, 'hij');
      deepStrictEqual(todoList, expectedTodoList);
    });
  });

  describe('deleteTask', () => {
    it('should delete matching task from the todoList', () => {
      const todoList = TodoList.load([
        {
          id: 1,
          title: 'abc',
          tasks: [
            { id: '1-1', status: false, content: 'def' },
            { id: '1-2', status: false, content: 'hij' }
          ],
          timeStamp
        }
      ]);
      const expectedTodoList = TodoList.load([
        {
          id: 1,
          title: 'abc',
          tasks: [{ id: '1-1', status: false, content: 'def' }],
          timeStamp
        }
      ]);
      todoList.deleteTask(1, '1-2');
      deepStrictEqual(todoList, expectedTodoList);
    });
  });

  describe('updateTaskStatus', () => {
    it('should make status of the matching task to true if it is false', () => {
      const todoList = TodoList.load([
        {
          id: 1,
          title: 'abc',
          tasks: [
            { id: '1-1', status: true, content: 'def' },
            { id: '1-2', status: false, content: 'hij' }
          ],
          timeStamp
        }
      ]);
      const expectedTodo = TodoList.load([
        {
          id: 1,
          title: 'abc',
          tasks: [
            { id: '1-1', status: true, content: 'def' },
            { id: '1-2', status: true, content: 'hij' }
          ],
          timeStamp
        }
      ]);
      todoList.updateTaskStatus(1, '1-2');
      deepStrictEqual(todoList, expectedTodo);
    });

    it('should make status of the matching task to false if it is true', () => {
      const todoList = TodoList.load([
        {
          id: 1,
          title: 'abc',
          tasks: [
            { id: '1-1', status: true, content: 'def' },
            { id: '1-2', status: false, content: 'hij' }
          ],
          timeStamp
        }
      ]);
      const expectedTodo = TodoList.load([
        {
          id: 1,
          title: 'abc',
          tasks: [
            { id: '1-1', status: false, content: 'def' },
            { id: '1-2', status: false, content: 'hij' }
          ],
          timeStamp
        }
      ]);
      todoList.updateTaskStatus(1, '1-1');
      deepStrictEqual(todoList, expectedTodo);
    });
  });

  describe('editTitle', () => {
    it('should edit the title of the matching todo', () => {
      const todoList = TodoList.load([
        {
          id: 1,
          title: 'abc',
          tasks: [{ id: '1-1', status: true, content: 'def' }],
          timeStamp
        }
      ]);
      const expectedTodoList = TodoList.load([
        {
          id: 1,
          title: 'def',
          tasks: [{ id: '1-1', status: true, content: 'def' }],
          timeStamp
        }
      ]);
      todoList.editTitle(1, 'def');
      deepStrictEqual(todoList, expectedTodoList);
    });
  });

  describe('editTask', () => {
    it('should edit the task of the matching todo', () => {
      const todoList = TodoList.load([
        {
          id: 1,
          title: 'abc',
          tasks: [{ id: '1-1', status: true, content: 'def' }],
          timeStamp
        }
      ]);
      const expectedTodoList = TodoList.load([
        {
          id: 1,
          title: 'abc',
          tasks: [{ id: '1-1', status: true, content: 'xyz' }],
          timeStamp
        }
      ]);
      todoList.editTask(1, '1-1', 'xyz');
      deepStrictEqual(todoList, expectedTodoList);
    });
  });
});
