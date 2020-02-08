let currentIdNo = 0;
let taskIdList = [];

const generateHtmlNewTodoPart = idNo => `
<label for="element" id="label-element" class="label-element">
&#10031;&nbsp;
</label>
<input type="text" name="element" class="inner-box" placeholder="Task..." />
<button id="delete-${idNo}" type="button" class="button" 
onclick="removeTask(this.id)">
 <img src="./images/remove-task.png" alt="" class="remove-task-icon">
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

const deleteTask = id => {
  sendXHR(id, '/deleteTask', 'POST');
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
  sendXHR(`${idNo}-${contentToSave}`, '/insertTask', 'POST');
};

const generateTaskDiv = task => {
  const imgSrc = task.status
    ? './images/checked-box.png'
    : './images/unchecked-box.png';
  return `
<div class="task">
  <button id="task-${task.id}" onclick="changeStatus(this.id)" class="button">
  <img src="${imgSrc}" alt="" class="checkbox">
  </button>
  <div class="task-content">
  ${task.content}
  </div>
  <button id="delete-task-${task.id}" onclick="deleteTask(this.id)" class="button">
  <img src="./images/delete-task.png" alt="" class="delete-task-icon">
  </button>
</div>`;
};

const generateHtmlForSavedTodo = ({ id, title, tasks, timeStamp }) => {
  const htmlLists = tasks.map(generateTaskDiv);
  const div = document.createElement('div');
  div.className = 'todo-log-element';
  div.id = `todo-${id}`;
  div.innerHTML = `
  <div class="todo-head">
    <span >
      <h3 class="todo-title">${title}</h3>
    </span>
    <button id="delete-button-${id}" onclick="deleteTodo(this.id)" class="button">
      <img src="./images/delete.png" alt="" class="delete-icon">
    </button>
  </div>
  <div class="task-list">
    ${htmlLists.join('\n')}
  </div>
  <div class="todo-tail">
    <button id="add-button-${id}" onclick="insertTask(this.id)" class="button">
      <img src="./images/add-task.png" alt="" class="delete-icon">
    </button>
    <div id="insert-task-${id}" class="insert-task-box">
      <input id="insert-task-input-${id}" type="text" name="element" class="task-box" placeholder="Task..." />
      <button id="save-inserted-${id}" onclick="saveInsertedTask(this.id)" class="button">
      <img src="./images/save.png" alt="" class="delete-icon">
      </button>
    </div>
    <p>created @ ${new Date(timeStamp).toLocaleString()}</p>
  </div>
  `;
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
