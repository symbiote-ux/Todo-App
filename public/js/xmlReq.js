const displaySignUpMsg = function() {
  if (this.status !== 200) {
    document.querySelector('#signUpError').innerText = 'User Already Exits';
  }
  emptyUserData('#signUpUserId', '#signUpPassword');
};

const signUp = () => {
  const userName = document.querySelector('#signUpUserId').value;
  const password = document.querySelector('#signUpPassword').value;
  const reqData = JSON.stringify({ userName, password });
  sendXHR(reqData, '/signUp', 'POST', displaySignUpMsg);
};

const login = () => {
  const userName = document.querySelector('#loginUserId').value;
  const password = document.querySelector('#loginPassword').value;
  const reqData = JSON.stringify({ userName, password });
  const callBack = function() {
    window.location.href = '/';
    if (this.status === 401) {
      document.querySelector('#loginError').innerText =
        'Incorrect Password or UserId';
      emptyUserData('#loginUserId', '#loginPassword');
    }
  };
  sendXHR(reqData, '/login', 'POST', callBack);
};

const formatContents = function() {
  const todoLists = JSON.parse(this.responseText);
  const formattedTodo = todoLists.map(generateHtmlForSavedTodo);
  const parentElement = document.querySelector('#todo-log');
  parentElement.innerHTML = '';
  formattedTodo.forEach(element => {
    parentElement.appendChild(element);
  });
};

const editTask = taskId => {
  const [todoId] = taskId.split('-');
  const task = document.querySelector(`#task-${taskId}`).value;
  const reqData = JSON.stringify({ todoId, taskId, task });
  sendXHR(reqData, '/editTask', 'POST', formatContents);
};

const editTitle = id => {
  const title = document.querySelector(`#title-${id}`).value;
  const reqData = JSON.stringify({ todoId: id, title });
  sendXHR(reqData, '/editTitle', 'POST', formatContents);
};

const deleteTask = id => {
  const [, , todoId, subId] = id.split('-');
  const reqData = JSON.stringify({ todoId, taskId: `${todoId}-${subId}` });
  sendXHR(reqData, '/deleteTask', 'POST', formatContents);
};

const saveInsertedTask = id => {
  const [, , idNo] = id.split('-');
  document.getElementById(`insert-task-${idNo}`).className = 'hidden';
  document.getElementById(`add-button-${idNo}`).style.display = 'block';
  const content = document.getElementById(`insert-task-input-${idNo}`).value;
  if (!content) {
    return;
  }
  const reqData = JSON.stringify({
    todoId: idNo,
    taskContent: `${content}`
  });
  sendXHR(reqData, '/insertTask', 'POST', formatContents);
};

const deleteTodo = id => {
  const [, , todoId] = id.split('-');
  sendXHR(`{"todoId":${+todoId}}`, './deleteTodo', 'POST', formatContents);
};

const changeStatus = id => {
  const [, , todoId, subId] = id.split('-');
  const reqData = JSON.stringify({ todoId, taskId: `${todoId}-${subId}` });
  sendXHR(reqData, '/updateTaskStatus', 'POST', formatContents);
};

const searchByTask = (searchedText, dataBase) => {
  const matchedTodo = dataBase.filter(todo => {
    let isTaskMatching = false;
    todo.tasks.forEach(task => {
      isTaskMatching = isTaskMatching || task.content.includes(searchedText);
    });
    return isTaskMatching;
  });
  const formattedTodo = matchedTodo.map(generateHtmlForSavedTodo);
  const parentElement = document.querySelector('#todo-log');
  parentElement.innerHTML = '';
  formattedTodo.forEach(element => {
    parentElement.appendChild(element);
  });
};

const searchByTitle = (searchedText, dataBase) => {
  const matchedTodo = dataBase.filter(todo => {
    return todo.title.includes(searchedText);
  });
  const formattedTodo = matchedTodo.map(generateHtmlForSavedTodo);
  const parentElement = document.querySelector('#todo-log');
  parentElement.innerHTML = '';
  formattedTodo.forEach(element => {
    parentElement.appendChild(element);
  });
};

const getTodoData = (id, type) => {
  fetchAllTodo(function() {
    const dataBase = JSON.parse(this.responseText);
    const searchArea = document.querySelector(`#${id}`);
    if (type === 'title') {
      searchByTitle(searchArea.value, dataBase);
    }
    if (type === 'task') {
      searchByTask(searchArea.value, dataBase);
    }
  });
};

const saveTodo = () => {
  const title = document.getElementById('title').value;
  const taskBoxes = document.querySelector('#todo-tasks').children;
  const tasks = [...taskBoxes].map(task => task.children[0].value);
  const reqData = JSON.stringify({ title, tasks });
  sendXHR(reqData, '/saveTodo', 'POST', formatContents);
  closeNewTodo();
};

const fetchAllTodo = callback => {
  const req = new XMLHttpRequest();
  req.onload = callback;
  req.open('GET', '/getTodoList');
  req.send();
};

const sendXHR = (data, url, method, callBack) => {
  const req = new XMLHttpRequest();
  req.open(method, url);
  req.setRequestHeader('Content-Type', 'application/json');
  req.send(data);
  req.onload = callBack;
};
