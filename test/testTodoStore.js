const { instanceOf, deepStrictEqual } = require('chai').assert;
const { TodoStore } = require('../lib/todoStore');
const { TodoList } = require('../lib/todoList');
const { Todo } = require('../lib/todo');

describe('TodoStore Class', () => {
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
});

/*
static load(allTodoList) {
addUser(userName) {
allTodo(userName) {
get allTodoList() {

editTask(userName, todoId, taskId, task) {
editTitle(userName, todoId, title) {
deleteTask(userName, todoId, taskId) {
insertTask(userName, todoId, taskContent) {
deleteTodo(userName, todoId) {
updateTaskStatus(userName, todoId, taskId) {
addTodo(userName, title, tasks, timeStamp) {
*/
