let currentIdNo = 0;
let taskIdList = [];

const makeDisplayBlock = id => {
  document.getElementById(id).style.display = 'block';
};

const makeDisplayNone = id => {
  document.getElementById(id).style.display = 'none';
};

const openNewTodo = () => {
  ['todo-title', 'close-todo', 'save-todo'].forEach(makeDisplayBlock);
  makeDisplayNone('add-todo');
};

const closeNewTodo = () => {
  document.getElementById('title').value = '';
  ['todo-title', 'close-todo', 'save-todo'].forEach(makeDisplayNone);
  makeDisplayBlock('add-todo');
  for (let idNo = 0; idNo < taskIdList.length; idNo++) {
    const element = document.getElementById(`todo-element-${taskIdList[idNo]}`);
    element.parentNode.removeChild(element);
  }
  currentIdNo = 0;
  taskIdList = [];
};

const removeTask = id => {
  const [, idNoToRemove] = id.split('-');
  const index = taskIdList.indexOf(+idNoToRemove);
  if (index > -1) {
    taskIdList.splice(index, 1);
  }
  const element = document.getElementById(`todo-element-${idNoToRemove}`);
  element.parentNode.removeChild(element);
};

const isTitleEmpty = () => {
  taskIdList.length === 0 && document.querySelector('#title').value === '';
};

const isElementEmpty = () =>
  taskIdList.length !== 0 &&
  document.querySelector(`#todo-element-${currentIdNo} input[name="element"]`).value === '';

const addTask = () => {
  if (isTitleEmpty()) {
    return;
  }
  if (isElementEmpty()) {
    return;
  }
  currentIdNo++;
  const htmlToAdd = createTaskHtml(currentIdNo);
  taskIdList.push(currentIdNo);
  document.querySelector('#todo-tasks').appendChild(htmlToAdd);
};

const clickSaveInsertedButton = idNo => {
  if (event.keyCode === 13) {
    document.querySelector(`#save-inserted-${idNo}`).click();
  }
};

const clickAddTaskButton = id => {
  if (event.keyCode === 13) {
    document.querySelector('#add-task').click();
    const elementToFocus =
      id === 'title'
        ? document.querySelector('#task-input-1')
        : document.querySelector(`#task-input-${id + 1}`);
    elementToFocus.focus();
  }
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

const insertTask = id => {
  const [, , idNo] = id.split('-');
  document.getElementById(id).style.display = 'none';
  document.getElementById(`insert-task-${idNo}`).className = 'insert-task-box';
};

const editTask = taskId => {
  const [todoId] = taskId.split('-');
  const task = document.querySelector(`#task-${taskId}`).value;
  const reqData = JSON.stringify({todoId, taskId, task});
  sendXHR(reqData, '/editTask', 'POST', formatContents);
};

const editTitle = id => {
  const title = document.querySelector(`#title-${id}`).value;
  const reqData = JSON.stringify({todoId: id, title});
  sendXHR(reqData, '/editTitle', 'POST', formatContents);
};

const deleteTask = id => {
  const [, , todoId, subId] = id.split('-');
  const reqData = JSON.stringify({todoId, taskId: `${todoId}-${subId}`});
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
  const reqData = JSON.stringify({todoId, taskId: `${todoId}-${subId}`});
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
  const reqData = JSON.stringify({title, tasks});
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
  const request = new XMLHttpRequest();
  request.open(method, url);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(data);
  request.onload = callBack;
};

window.onload = fetchAllTodo(formatContents);
