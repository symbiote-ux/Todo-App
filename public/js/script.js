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

const isTitleEmpty = () =>
  taskIdList.length === 0 && document.querySelector('#title').value === '';

const isElementEmpty = () =>
  taskIdList.length !== 0 &&
  document.querySelector(`#todo-element-${currentIdNo} input[name="element"]`)
    .value === '';

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

const getTodoDataString = () => {
  const title = document.getElementById('title').value;
  const tasks = document.querySelector('#todo-tasks').children;
  const lists = [...tasks].map(task => task.children[1].value);
  return `{"title":"${title}","tasks":${JSON.stringify(lists)}}`;
};

const deleteTodo = id => {
  const [, , todoId] = id.split('-');
  sendXHR(`{"todoId":${+todoId}}`, './deleteTodo', 'POST');
};

const changeStatus = id => {
  const [, todoId, subId] = id.split('-');
  const reqData = JSON.stringify({ todoId, taskId: `${todoId}-${subId}` });
  sendXHR(reqData, '/updateTaskStatus', 'POST');
};

const deleteTask = id => {
  const [, , todoId, subId] = id.split('-');
  const reqData = JSON.stringify({ todoId, taskId: `${todoId}-${subId}` });
  sendXHR(reqData, '/deleteTask', 'POST');
};

const insertTask = id => {
  const [, , idNo] = id.split('-');
  document.getElementById(id).style.display = 'none';
  document.getElementById(`insert-task-${idNo}`).style.display = 'block';
};

const saveInsertedTask = id => {
  const [, , idNo] = id.split('-');
  document.getElementById(`insert-task-${idNo}`).style.display = 'none';
  document.getElementById(`add-button-${idNo}`).style.display = 'block';
  const contentToSave = document.getElementById(`insert-task-input-${idNo}`)
    .value;
  if (!contentToSave) {
    return;
  }
  const reqData = JSON.stringify({
    todoId: idNo,
    taskContent: `${contentToSave}`
  });
  sendXHR(reqData, '/insertTask', 'POST');
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

const sendXHR = (data, url, method) => {
  const request = new XMLHttpRequest();
  request.open(method, url);
  request.send(data);
  request.onload = formatContents;
};

const save = () => {
  sendXHR(getTodoDataString(), '/saveTodo', 'POST');
  closeNewTodo();
};

window.onload = sendXHR('', '/getTodoLists', 'GET');
