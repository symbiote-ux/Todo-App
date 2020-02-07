let currentIdNo = 0;
let taskIdList = [];

const generateHtmlNewTodoPart = idNo => `
<label for="element" id="label-element" class="label-element">
&#10031;&nbsp;
</label>
<input type="text" name="element" class="inner-box" placeholder="Task..." />

<button id="delete-${idNo}" type="button" class="button" 
onclick="removeTask(this.id)">
  -
</button>`;

const createTaskHtml = idNo => {
  const div = document.createElement('div');
  div.id = `todo-element-${idNo}`;
  div.className = 'todo-parts';
  div.innerHTML = generateHtmlNewTodoPart(idNo);
  return div;
};

const openNewTodo = () => {
  document.getElementById('todo-title').style.display = 'block';
  document.getElementById('add-todo').style.display = 'none';
  document.getElementById('close-todo').style.display = 'block';
  document.getElementById('save-todo').style.display = 'block';
};

const closeNewTodo = () => {
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
  return `title=${title}&tasks=${JSON.stringify(lists)}`;
};

const deleteTodo = id => {
  const [, , todoId] = id.split('-');
  sendXHR(todoId, './deleteTodo', 'POST');
};

const changeStatus = id => {
  sendXHR(id, '/updateTaskStatus', 'POST');
};

const generateTaskDiv = task => {
  const imgSrc = task.status ? './checked-box.png' : './unchecked-box.png';
  return `
<div>
  <button id="task-${task.id}" onclick="changeStatus(this.id)" class="button">
  <img src="${imgSrc}" alt="" class="checkbox">
  </button>
  ${task.content}
</div>`;
};

const generateHtmlForSavedTodo = ({ id, title, tasks, timeStamp }) => {
  const htmlLists = tasks.map(generateTaskDiv);
  const div = document.createElement('div');
  div.className = 'todo-log-element';
  div.id = `todo-${id}`;
  div.innerHTML = `
  <button id="delete-button-${id}" onclick="deleteTodo(this.id)" class="button">
  &#9988;
  </button>
  <h3>${title}</h3>
  <div>
    ${htmlLists.join('\n')}
  </div>
  <p>created @ ${new Date(timeStamp).toLocaleString()}</p>`;
  return div;
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
  sendXHR(getTodoDataString(), '/saveToDo', 'POST');
  closeNewTodo();
};
