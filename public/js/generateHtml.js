const generateHtmlNewTodoPart = idNo => `
<input id="task-input-${idNo}" type="text" name="element" class="input-box" 
  placeholder="Task..." onkeypress="clickAddTaskButton(${idNo})"/>
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

const generateHtmlForSavedTodo = ({ id, title, tasks, timeStamp }) => {
  const htmlLists = tasks.map(generateTaskDiv);
  const div = document.createElement('div');
  div.className = 'todo-log-element';
  div.id = `todo-${id}`;
  div.innerHTML = `
  ${getHtmlForTodoTitlePart(title, id)}
  <div class="task-list">
    ${htmlLists.join('\n')}
  </div>
  ${getHtmlForTodoTailPart(id, timeStamp)}`;
  return div;
};

const generateTaskDiv = task => {
  const imgSrc = task.status
    ? './images/checked-box.png'
    : './images/unchecked-box.png';
  return `
<div class="task">
  <button id="task-status-${task.id}" 
    onclick="changeStatus(this.id)" class="button">
  <img src="${imgSrc}" alt="" class="checkbox">
  </button>
  <input class="task-content" value="${task.content}" 
    id="task-${task.id}" onblur="editTask('${task.id}')"/>
  <button id="delete-task-${task.id}" onclick="deleteTask(this.id)" 
  class="button">
  <img src="./images/delete-task.png" alt="" class="delete-task-icon">
  </button>
</div>`;
};

const getHtmlForTodoTitlePart = (title, id) => `
<div class="todo-head">
  <span >
    <input type="text" contenteditable="true" onblur="editTitle(${id})"
     class="todo-block-title" id="title-${id}" value="${title}">
  </span>
  <button id="delete-button-${id}" onclick="deleteTodo(this.id)" class="button">
    <img src="./images/delete.png" alt="" class="delete-icon">
  </button>
</div>`;

const getHtmlForTodoTailPart = (id, timeStamp) => `
<div class="todo-tail">
  <button id="add-button-${id}" onclick="insertTask(this.id)" class="button">
    <img src="./images/add-task.png" alt="" class="delete-icon">
  </button>
  <div id="insert-task-${id}" class="hidden">
    <input id="insert-task-input-${id}" type="text" name="element" 
    onkeypress="clickSaveInsertedButton(${id})"
    class="task-box" placeholder="Task..." />
    <button id="save-inserted-${id}" onclick="saveInsertedTask(this.id)" 
    class="button">
    <img src="./images/save.png" alt="" class="delete-icon">
    </button>
  </div>
  <p class="date">created @ ${new Date(timeStamp).toLocaleString()}</p>
</div>`;
