const elementHtml = `
  <div id="todo-element-__idNo__" class="todo-parts">
    <label for="element" id="label-element" class="label-element">
    <input type="checkbox" name="" </label>
    </label>
    <input type="text" name="element" class="inner-box" required />
    <button id="delete-__idNo__" type="button" class="button" onclick="removeTask(this.id)">
      -
    </button>
  </div>`;

let currentIdNo = 0;
let taskIdList = [];

const openNewTodo = () => {
  document.getElementById('todo-title').style.display = 'block';
  document.getElementById('add').style.display = 'none';
  document.getElementById('close').style.display = 'block';
  document.getElementById('save').style.display = 'block';
};

closeNewTodo = () => {
  document.getElementById('todo-title').style.display = 'none';
  document.getElementById('add').style.display = 'block';
  document.getElementById('close').style.display = 'none';
  for (let idNo = 0; idNo < taskIdList.length; idNo++) {
    const element = document.getElementById(`todo-element-${taskIdList[idNo]}`);
    element.parentNode.removeChild(element);
  }
  currentIdNo = 0;
  taskIdList = [];
};

const createTask = () => {
  currentIdNo = 1;
  document.getElementById(`todo-element-${currentIdNo}`).style.display =
    'block';
  taskIdList.push(currentIdNo);
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

const addTask = () => {
  currentIdNo++;
  const htmlToAdd = elementHtml.replace(/__idNo__/g, currentIdNo);
  taskIdList.push(currentIdNo);
  document.querySelector('#todo-tasks').innerHTML =
    document.querySelector('#todo-tasks').innerHTML + `${htmlToAdd}`;
};

const formatTodo = function() {
  prepareTodoListToShow(JSON.parse(this.responseText));
};

const prepareTextToSend = function() {
  const title = document.getElementById('title').value;
  const tasks = document.querySelector('#todo-tasks').childNodes;
  console.log(tasks);

  const lists = [...tasks].map(task => task.value);
  return `title=${title}&tasks=${JSON.stringify(lists)}`;
};

const sendXHR = function(data, url, method, callback) {
  const request = new XMLHttpRequest();
  request.open(method, url);
  request.send(data);
  request.onload = callback;
};

const save = () => {
  sendXHR(prepareTextToSend(), '/saveToDo', 'POST', formatTodo);
};
