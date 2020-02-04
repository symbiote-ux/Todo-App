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

const addTask = () => {
  currentIdNo++;
  const htmlToAdd = createTaskHtml(currentIdNo);
  taskIdList.push(currentIdNo);
  document.querySelector('#todo-tasks').appendChild(htmlToAdd);
};
