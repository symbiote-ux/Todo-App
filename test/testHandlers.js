const request = require('supertest');
const { app } = require('../lib/routes');

describe('GET before login', () => {
  it('should redirect to login page on /', done => {
    request(app)
      .get('/')
      .expect(302, done)
      .expect('location', '/user/index.html')
      .expect('Content-Type', 'text/plain; charset=utf-8');
  });

  it('should redirect to login page on /style.css', done => {
    request(app)
      .get('/css/style.css')
      .expect(302, done)
      .expect('location', '/user/index.html')
      .expect('Content-Type', 'text/plain; charset=utf-8');
  });

  it('should redirect to login page on /getTodoList', done => {
    request(app)
      .get('/getTodoList')
      .expect(302, done)
      .expect('location', '/user/index.html')
      .expect('Content-Type', 'text/plain; charset=utf-8');
  });

  it('should redirect to login page on /url', done => {
    request(app)
      .get('/url')
      .expect(302, done)
      .expect('location', '/user/index.html')
      .expect('Content-Type', 'text/plain; charset=utf-8');
  });
});

describe('POST before login', () => {
  it('should save the new todo on /saveTodo', done => {
    request(app)
      .post('/saveTodo')
      .expect(302, done)
      .expect('location', '/user/index.html')
      .expect('Content-Type', 'text/plain; charset=utf-8');
  });

  it('should toggle the status of the task on /updateTaskStatus', done => {
    request(app)
      .post('/updateTaskStatus')
      .expect(302, done)
      .expect('location', '/user/index.html')
      .expect('Content-Type', 'text/plain; charset=utf-8');
  });

  it('should insert a task on /insertTask', done => {
    request(app)
      .post('/insertTask')
      .expect(302, done)
      .expect('location', '/user/index.html')
      .expect('Content-Type', 'text/plain; charset=utf-8');
  });

  it('should delete a task on /deleteTask', done => {
    request(app)
      .post('/deleteTask')
      .expect(302, done)
      .expect('location', '/user/index.html')
      .expect('Content-Type', 'text/plain; charset=utf-8');
  });

  it('should edit the title on /editTitle', done => {
    request(app)
      .post('/editTitle')
      .expect(302, done)
      .expect('location', '/user/index.html')
      .expect('Content-Type', 'text/plain; charset=utf-8');
  });

  it('should edit the task on /editTask', done => {
    request(app)
      .post('/editTask')
      .expect(302, done)
      .expect('location', '/user/index.html')
      .expect('Content-Type', 'text/plain; charset=utf-8');
  });

  it('should delete the todo on /deleteTodo', done => {
    request(app)
      .post('/deleteTodo')
      .expect(302, done)
      .expect('location', '/user/index.html')
      .expect('Content-Type', 'text/plain; charset=utf-8');
  });

  it('should give an error pageNotFound with status code 404', done => {
    request(app)
      .post('/badRequest')
      .expect(302, done)
      .expect('location', '/user/index.html')
      .expect('Content-Type', 'text/plain; charset=utf-8');
  });
});

describe('login/signUp', () => {
  it('should signup a user on /signup', done => {
    request(app)
      .post('/signup')
      .send({ userName: 'abcd', password: '1234' })
      .expect(200, done);
  });

  it('should return conflict if a user is already present on /signup', done => {
    request(app)
      .post('/signup')
      .send({ userName: 'abcd', password: '1234' })
      .expect(409, done)
      .expect(/Conflict/);
  });

  it('should login a the signed up user on /login', done => {
    request(app)
      .post('/login')
      .send({ userName: 'abcd', password: '1234' })
      .expect(200, done);
  });
  it('Give unauthorized if userId or passWord is wrong on /login', done => {
    request(app)
      .post('/login')
      .send({ userName: 'abcd', password: 'wrong' })
      .expect(401, done)
      .expect(/Unauthorized/);
  });
});

describe('GET after login', () => {
  it('should redirect to login page on /', done => {
    request(app)
      .get('/')
      .set('Cookie', ['SID=1'])
      .expect(302, done)
      .expect('location', '/homePage.html')
      .expect('Content-Type', 'text/plain; charset=utf-8');
  });

  it('should redirect to login page on /style.css', done => {
    request(app)
      .get('/css/style.css')
      .set('Cookie', ['SID=1'])
      .expect(200, done)
      .expect('Content-Type', 'text/css; charset=UTF-8');
  });

  it('should redirect to login page on /getTodoList', done => {
    request(app)
      .get('/getTodoList')
      .set('Cookie', ['SID=1'])
      .expect(200, done)
      .expect('Content-Type', 'application/json; charset=utf-8');
  });

  it('should redirect to login page on /BadUrl', done => {
    request(app)
      .get('/BadUrl')
      .set('Cookie', ['SID=1'])
      .expect(404, done)
      .expect(/Cannot GET \/BadUrl/)
      .expect('Content-Type', 'text/html; charset=utf-8');
  });
});

describe('POST after login', () => {
  it('should save the new todo on /saveTodo', done => {
    request(app)
      .post('/saveTodo')
      .set('Cookie', ['SID=1'])
      .send({ title: 'HomeWork', tasks: ['Physics', 'Maths'] })
      .expect(200, done)
      .expect('Content-Type', 'application/json; charset=utf-8');
  });

  it('should toggle the status of the task on /updateTaskStatus', done => {
    request(app)
      .post('/updateTaskStatus')
      .set('Cookie', ['SID=1'])
      .send({ todoId: 1, taskId: '1-1' })
      .expect(200, done)
      .expect('Content-Type', 'application/json; charset=utf-8');
  });

  it('should insert a task on /insertTask', done => {
    request(app)
      .post('/insertTask')
      .set('Cookie', ['SID=1'])
      .send({ todoId: 1, taskContent: 'Maths' })
      .expect(200, done)
      .expect('Content-Type', 'application/json; charset=utf-8');
  });

  it('should delete a task on /deleteTask', done => {
    request(app)
      .post('/deleteTask')
      .set('Cookie', ['SID=1'])
      .send({ todoId: 1, taskId: '1-2' })
      .expect(200, done)
      .expect('Content-Type', 'application/json; charset=utf-8');
  });

  it('should edit the title on /editTitle', done => {
    request(app)
      .post('/editTitle')
      .set('Cookie', ['SID=1'])
      .send({ todoId: 1, title: 'newTitle' })
      .expect(200, done)
      .expect('Content-Type', 'application/json; charset=utf-8');
  });

  it('should edit the task on /editTask', done => {
    request(app)
      .post('/editTask')
      .set('Cookie', ['SID=1'])
      .send({ todoId: 1, taskId: '1-1', task: 'newTask' })
      .expect(200, done)
      .expect('Content-Type', 'application/json; charset=utf-8');
  });

  it('should delete the todo on /deleteTodo', done => {
    request(app)
      .post('/deleteTodo')
      .set('Cookie', ['SID=1'])
      .send({ todoId: 1 })
      .expect(200, done)
      .expect('Content-Type', 'application/json; charset=utf-8');
  });

  it('should give an error pageNotFound with status code 404', done => {
    request(app)
      .post('/badRequest')
      .set('Cookie', ['SID=1'])
      .expect(404, done)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(/Cannot POST \/badRequest/);
  });
});

describe('Request with incomplete body', () => {
  it('should reply with status 404 if incomplete body on /saveTodo', done => {
    request(app)
      .post('/saveTodo')
      .set('Cookie', ['SID=1'])
      .send('{ "title" :"home work" }')
      .expect(/Cannot POST \/saveTodo/)
      .expect(404, done)
      .expect('Content-Type', 'text/html; charset=utf-8');
  });

  it('should reply with status 404 if incomplete body on /deleteTask', done => {
    request(app)
      .post('/deleteTask')
      .set('Cookie', ['SID=1'])
      .send('{ "todoId" : 1 }')
      .expect(/Cannot POST \/deleteTask/)
      .expect(404, done)
      .expect('Content-Type', 'text/html; charset=utf-8');
  });

  it('should reply with status 404 if incomplete body on /deleteTodo', done => {
    request(app)
      .post('/deleteTodo')
      .set('Cookie', ['SID=1'])
      .send('{}')
      .expect(/Cannot POST \/deleteTodo/)
      .expect(404, done)
      .expect('Content-Type', 'text/html; charset=utf-8');
  });

  it('should give 404 if /updateTaskStatus has incomplete body', done => {
    request(app)
      .post('/updateTaskStatus')
      .set('Cookie', ['SID=1'])
      .send('{ "todoId" : 1 }')
      .expect(/Cannot POST \/updateTaskStatus/)
      .expect(404, done)
      .expect('Content-Type', 'text/html; charset=utf-8');
  });

  it('should give status 404 if /insertTask has incomplete body', done => {
    request(app)
      .post('/insertTask')
      .set('Cookie', ['SID=1'])
      .send('{ "todoId" : 1 }')
      .expect(/Cannot POST \/insertTask/)
      .expect(404, done)
      .expect('Content-Type', 'text/html; charset=utf-8');
  });

  it('should give status 404 if /editTitle has incomplete body', done => {
    request(app)
      .post('/editTitle')
      .set('Cookie', ['SID=1'])
      .send('{ "todoId" : 1 }')
      .expect(/Cannot POST \/editTitle/)
      .expect(404, done)
      .expect('Content-Type', 'text/html; charset=utf-8');
  });

  it('should give status 404 if /editTask has incomplete body', done => {
    request(app)
      .post('/editTask')
      .set('Cookie', ['SID=1'])
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
      .set('Cookie', ['SID=1'])
      .expect(404, done)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(/Cannot PUT \/badRequest/);
  });
});
