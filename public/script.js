const generateInnerHtml = idNo => `
<label for="element" id="label-element" class="label-element">
  <input type="checkbox">
</label>
<input type="text" name="element" class="inner-box" required />
<button id="delete-${idNo}" type="button" class="button" onclick="removeTask(this.id)">
  -
</button>`;

const createTaskHtml = idNo => {
  const div = document.createElement('div');
  div.id = `todo-element-${idNo}`;
  div.className = 'todo-parts';
  div.innerHTML = generateInnerHtml(idNo);
  return div;
};

let currentIdNo = 0;
let taskIdList = [];

const openNewTodo = () => {
  document.getElementById('todo-title').style.display = 'block';
  document.getElementById('add-todo').style.display = 'none';
  document.getElementById('close-todo').style.display = 'block';
  document.getElementById('save-todo').style.display = 'block';
};

closeNewTodo = () => {
  document.getElementById('title').value = '';
  document.getElementById('todo-title').style.display = 'none';
  document.getElementById('add-todo').style.display = 'block';
  document.getElementById('close-todo').style.display = 'none';
  document.getElementById('save-todo').style.display = 'none';
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
  taskIdList.length === 0 && document.querySelector(`#title`).value === '';

const isElementEmpty = () =>
  taskIdList.length !== 0 &&
  document.querySelector(`#todo-element-${currentIdNo} input[name="element"]`)
    .value === '';

const addTask = () => {
  if (isTitleEmpty()) return;
  if (isElementEmpty()) return;
  currentIdNo++;
  const htmlToAdd = createTaskHtml(currentIdNo);
  taskIdList.push(currentIdNo);
  document.querySelector('#todo-tasks').appendChild(htmlToAdd);
};

const getTodoDataString = function() {
  const title = document.getElementById('title').value;
  const tasks = document.querySelector('#todo-tasks').children;
  const lists = [...tasks].map(task => task.children[1].value);
  return `title=${title}&tasks=${JSON.stringify(lists)}`;
};

const generateHtmlForTodo = ({ title, tasks, timeStamp }) => {
  const htmlLists = tasks.map(task => `<li>${task}</li>`);
  const div = document.createElement('div');
  div.className = 'todo-log-element';
  div.innerHTML = `
  <h3>${title}</h3>
  <ul>
    ${htmlLists.join('\n')}
  </ul>
  <p>created @ ${new Date(timeStamp)}</p>`;
  return div;
};

const formatContents = function() {
  const todoLists = JSON.parse(this.responseText);
  const formattedTodo = todoLists.map(generateHtmlForTodo);
  const parentElement = document.querySelector('#todo-log');
  parentElement.innerHTML = '';
  formattedTodo.forEach(element => {
    parentElement.appendChild(element);
  });
};

const sendXHR = function(data, url, method) {
  const request = new XMLHttpRequest();
  request.open(method, url);
  request.send(data);
  request.onload = formatContents;
};

const save = () => {
  sendXHR(getTodoDataString(), '/saveToDo', 'POST');
  closeNewTodo();
};
