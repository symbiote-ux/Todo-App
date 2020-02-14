const request = require('supertest');
const {app} = require('../lib/handler');

describe('GET', () => {
  it('should give homepage on "/" req', done => {
    request(app)
      .get('/')
      .expect(200, done)
      .expect('Content-Type', 'text/html; charset=UTF-8');
  });

  it('should give css for /style.css', done => {
    request(app)
      .get('/css/style.css')
      .expect(200, done)
      .expect('Content-Type', 'text/css; charset=UTF-8');
  });

  it('should fetch all todo content on /getTodoList', done => {
    request(app)
      .get('/getTodoList')
      .expect(200, done)
      .expect('Content-Type', 'application/json; charset=utf-8');
  });

  it('should return an error: Bad Request on /badUrl', done => {
    request(app)
      .get('/badUrl')
      .expect(404, done)
      .expect(/Cannot GET \/badUrl/)
      .expect('Content-Type', 'text/html; charset=utf-8');
  });
});

describe('POST', () => {
  it('should save the new todo on /saveTodo', done => {
    request(app)
      .post('/saveTodo')
      .send({title: 'HomeWork', tasks: ['Physics', 'Maths']})
      .expect(200, done)
      .expect('Content-Type', 'application/json; charset=utf-8');
  });

  it('should toggle the status of the task on /updateTaskStatus', done => {
    request(app)
      .post('/updateTaskStatus')
      .send({todoId: 1, taskId: '1-1'})
      .expect(200, done)
      .expect('Content-Type', 'application/json; charset=utf-8');
  });

  it('should insert a task on /insertTask', done => {
    request(app)
      .post('/insertTask')
      .send({todoId: 1, taskContent: 'Maths'})
      .expect(200, done)
      .expect('Content-Type', 'application/json; charset=utf-8');
  });

  it('should delete a task on /deleteTask', done => {
    request(app)
      .post('/deleteTask')
      .send({todoId: 1, taskId: '1-2'})
      .expect(200, done)
      .expect('Content-Type', 'application/json; charset=utf-8');
  });

  it('should edit the title on /editTitle', done => {
    request(app)
      .post('/editTitle')
      .send({todoId: 1, title: 'newTitle'})
      .expect(200, done)
      .expect('Content-Type', 'application/json; charset=utf-8');
  });

  it('should edit the task on /editTask', done => {
    request(app)
      .post('/editTask')
      .send({todoId: 1, taskId: '1-1', task: 'newTask'})
      .expect(200, done)
      .expect('Content-Type', 'application/json; charset=utf-8');
  });

  it('should delete the todo on /deleteTodo', done => {
    request(app)
      .post('/deleteTodo')
      .send({todoId: 1})
      .expect(200, done)
      .expect('Content-Type', 'application/json; charset=utf-8');
  });

  it('should give an error pageNotFound with status code 404', done => {
    request(app)
      .post('/badRequest')
      .expect(404, done)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(/Cannot POST \/badRequest/);
  });
});

describe('Request with incomplete body', () => {
  it('should reply with status 404 if incomplete body on /saveTodo', done => {
    request(app)
      .post('/saveTodo')
      .send('{ "title" :"home work" }')
      .expect(/Cannot POST \/saveTodo/)
      .expect(404, done)
      .expect('Content-Type', 'text/html; charset=utf-8');
  });

  it('should reply with status 404 if incomplete body on /deleteTask', done => {
    request(app)
      .post('/deleteTask')
      .send('{ "todoId" : 1 }')
      .expect(/Cannot POST \/deleteTask/)
      .expect(404, done)
      .expect('Content-Type', 'text/html; charset=utf-8');
  });

  it('should reply with status 404 if incomplete body on /deleteTodo', done => {
    request(app)
      .post('/deleteTodo')
      .send('{}')
      .expect(/Cannot POST \/deleteTodo/)
      .expect(404, done)
      .expect('Content-Type', 'text/html; charset=utf-8');
  });

  it('should give 404 if /updateTaskStatus has incomplete body', done => {
    request(app)
      .post('/updateTaskStatus')
      .send('{ "todoId" : 1 }')
      .expect(/Cannot POST \/updateTaskStatus/)
      .expect(404, done)
      .expect('Content-Type', 'text/html; charset=utf-8');
  });

  it('should give status 404 if /insertTask has incomplete body', done => {
    request(app)
      .post('/insertTask')
      .send('{ "todoId" : 1 }')
      .expect(/Cannot POST \/insertTask/)
      .expect(404, done)
      .expect('Content-Type', 'text/html; charset=utf-8');
  });

  it('should give status 404 if /editTitle has incomplete body', done => {
    request(app)
      .post('/editTitle')
      .send('{ "todoId" : 1 }')
      .expect(/Cannot POST \/editTitle/)
      .expect(404, done)
      .expect('Content-Type', 'text/html; charset=utf-8');
  });

  it('should give status 404 if /editTask has incomplete body', done => {
    request(app)
      .post('/editTask')
      .send('{ "todoId" : 1, "taskId" : "1-1" }')
      .expect(/Cannot POST \/editTask/)
      .expect(404, done)
      .expect('Content-Type', 'text/html; charset=utf-8');
  });
});

describe('PUT', () => {
  it('should give an error badRequest with status code 400', done => {
    request(app)
      .put('/badRequest')
      .expect(404, done)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(/Cannot PUT \/badRequest/);
  });
});
