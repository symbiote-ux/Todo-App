let currentIdNo = 0;
let taskIdList = [];

const showSignUpBox = () => {
  document.querySelector('#signUpBox').className = 'show';
  document.querySelector('#loginBox').className = 'hidden';
};

const showLoginBox = () => {
  document.querySelector('#loginBox').className = 'show';
  document.querySelector('#signUpBox').className = 'hidden';
};

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

const insertTask = id => {
  const [, , idNo] = id.split('-');
  document.getElementById(id).style.display = 'none';
  document.getElementById(`insert-task-${idNo}`).className = 'insert-task-box';
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

const emptyUserData = (id, password) => {
  document.querySelector(id).value = '';
  document.querySelector(password).value = '';
};

const clearError = operation => {
  document.querySelector(`#${operation}Error`).innerText = '';
};
