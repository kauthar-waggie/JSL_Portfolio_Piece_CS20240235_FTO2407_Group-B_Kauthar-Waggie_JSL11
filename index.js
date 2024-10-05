// TASK: import helper functions from utils
import { getTasks, createNewTask, patchTask, putTask, deleteTask, } from './utils/taskFunctions.js';
// TASK: import initialData
import {initialData} from './initialData.js';


/*************************************************************************************************************************************************
 * FIX BUGS!!!
 * **********************************************************************************************************************************************/

// Function checks if local storage already has data, if not it loads initialData to localStorage
function initializeData() {
  if (!localStorage.getItem('tasks')) {
    try {
      localStorage.setItem('tasks', JSON.stringify(initialData)); // Load initial data
      localStorage.setItem('showSideBar', 'true'); // Set showSideBar
      console.log('Initial data loaded into localStorage');
    } catch (error) {
      console.error('Error saving data to localStorage', error);
    }
  } else {
    console.log('Data already exists in localStorage');
  }
}
initializeData();

// TASK: Get elements from the DOM
//initializeData() 
  const elements = { //added here
    sidebar: document.getElementById('side-bar-div'),
    sidelogo: document.getElementById('side-logo-div'),
    logo: document.getElementById('logo'),
    boardsNavLinksDiv: document.getElementById('boards-nav-links-div'),
    sideBarBottom: document.getElementsByClassName('side-bar-bottom'),
    toggleDiv: document.getElementsByClassName('toggle-div'),
    iconDarkTheme: document.getElementById('icon-dark'),
    themeToggle: document.getElementById('switch'),
    labelCheckboxTheme: document.getElementById('label-checkbox-theme'),
    iconLightTheme: document.getElementById('icon-light'),
    hideSideBarDiv: document.getElementsByClassName('hide-side-bar-div'),
    hideSidebarBtn: document.getElementById('hide-side-bar-btn'),
    showSidebarBtn: document.getElementById('show-side-bar-btn'),
    layout: document.getElementById('layout'),
    stickyHeader: document.getElementById('header'),
    headerNameDiv: document.getElementsByClassName('header-name-div'),
    logoMobile: document.getElementsByClassName('logo-mobile'),
    headerBoardName: document.getElementById('header-board-name'),
    dropdownBtn: document.getElementById('dropdownBtn'),
    dropDownIcon: document.getElementById('dropDownIcon'),
    addNewTaskBtn: document.getElementById('add-new-task-btn'),
    editBoardBtn: document.getElementById('edit-board-btn'),
    boardBtn: document.querySelectorAll('.board-btn'),
    threeDotsIcon: document.getElementById('three-dots-icon'),
    editBoardDiv: document.getElementById('editBoardDiv'),
    deleteBoardBtn: document.getElementById('deleteBoardBtn'),
    cardColumnMain: document.getElementsByClassName('card-column-main'),
    taskContainers: document.querySelectorAll('.tasks-container'),
    filterDiv: document.getElementById('filterDiv'),
    modalWindow: document.getElementById('new-task-modal-window'),
    editTaskModal: document.getElementById('edit-task-modal'), 
    todoHeadDiv: document.getElementById('todo-head-div'),
    todoDot: document.getElementById('todo-dot'),
    toDoTect: document.getElementById('toDoText'),
    tasksContainer: document.getElementsByClassName('tasks-container'),
    doingHeadDiv: document.getElementById('doing-head-div'),
    doingDot: document.getElementById('doing-dot'),
    doingText: document.getElementById('doingText'),
    doneHeadDiv: document.getElementById('done-head-div'),
    doneDot: document.getElementById('done-dot'),
    doneText: document.getElementById('doneText'),
    columnHeader: document.getElementsByClassName('columnHeader'),
    newTaskModalWindow: document.getElementById('new-task-modal-window'),
    modalTitle: document.getElementsByClassName('modal-title'),
    inputDiv: document.querySelectorAll('.input-div'),
    modalTitleInput: document.getElementById('modal-title-input'),
    titleInput: document.getElementById('title-input'),
    modalDescInput: document.getElementById('modal-desc-input'),
    descInput: document.getElementById('desc-input'),
    modalSelectStatus: document.getElementById('modal-select-status'),
    selectStatus: document.getElementById('select-status'),
    buttonGroup: document.getElementsByClassName('button-group'),
    createTaskBtn: document.getElementById('create-task-btn'),
    cancelAddTaskBtn: document.getElementById('cancel-add-task-btn'),
    editTaskModalWindow: document.querySelector('edit-task-modal-window'),
    editTaskForm: document.getElementById('edit-task-form'),
    editTaskHeader: document.getElementById('edit-task-header'),
    editTaskTitleInput: document.getElementById('edit-task-title-input'),
    editBtns: document.querySelectorAll('edit-btns'),
    editTaskDiv: document.querySelectorAll('.edit-task-div'),
    editTaskDescInput: document.getElementById('edit-task-desc-input'),
    labelModalWindow: document.getElementsByClassName('label-modal-window'),
    editSelectStatus: document.getElementById('edit-select-status'),
    editTaskDivButtonGroup: document.getElementsByClassName('edit-task-div button-group'),
    saveTaskChanges: document.getElementById('save-task-changes'),
    cancelEditBtn: document.getElementById('cancel-edit-btn'),
    deleteTaskBtn: document.getElementById('delete-task-btn'),
    columnDivs: document.querySelectorAll('.column-div'),
    taskDiv: document.getElementsByClassName('task-div'),
    dataTaskId: document.getElementById('data-task-id'),
  }
let activeBoard = ""

// Extracts unique board names from tasks
// TASK: FIX BUGS
function fetchAndDisplayBoardsAndTasks() {
  const tasks = getTasks(); // This retrieve tasks from localStorage
  const boards = [...new Set(tasks.map(task => task.board).filter(Boolean))];
  displayBoards(boards);
  if (boards.length > 0) {
    const localStorageBoard = JSON.parse(localStorage.getItem("activeBoard"));
    activeBoard = localStorageBoard ? localStorageBoard :  boards[0]; // fixed the semicolon to ||
    elements.headerBoardName.textContent = activeBoard;
    styleActiveBoard(activeBoard);
    refreshTasksUI();
  }
}


// Creates different boards in the DOM
// TASK: Fix Bugs
function displayBoards(boards) {
  const boardsContainer = document.getElementById("boards-nav-links-div"); //added here
  boardsContainer.innerHTML = ''; // Clears the container
  boards.forEach(board => {
    const boardElement = document.createElement("button");
    boardElement.textContent = board;
    boardElement.classList.add("board-btn");
    boardElement.addEventListener('click', () => { // added here a event listener
      elements.headerBoardName.textContent = board;
      filterAndDisplayTasksByBoard(board);
      activeBoard = board //assigns active board
      localStorage.setItem("activeBoard", JSON.stringify(activeBoard))
      styleActiveBoard(activeBoard)
    });
    boardsContainer.appendChild(boardElement);
  });

}

// Filters tasks corresponding to the board name and displays them on the DOM.
// TASK: Fix Bugs
function filterAndDisplayTasksByBoard(boardName) {
  const tasks = getTasks(); // Fetch tasks from a simulated local storage function
  const filteredTasks = tasks.filter(task => task.board === boardName); //added here ==

  // Ensure the column titles are set outside of this function or correctly initialized before this function runs

  elements.columnDivs.forEach(column => {
    const status = column.getAttribute("data-status");
    // Reset column content while preserving the column title
    column.innerHTML = `<div class="column-head-div">
                          <span class="dot" id="${status}-dot"></span>
                          <h4 class="columnHeader">${status.toUpperCase()}</h4>
                        </div>`;

    const tasksContainer = document.createElement("div");
    tasksContainer.classList.add('tasks-container'); // added here classlist
    column.appendChild(tasksContainer);

    filteredTasks
    .filter(task => task.status === status) //added here === and correct format
    .forEach(task => { 
      const taskElement = document.createElement("div");
      taskElement.classList.add("task-div");
      taskElement.textContent = task.title;
      taskElement.setAttribute('data-task-id', task.id);
      

      // Listen for a click event on each task and open a modal
      taskElement.addEventListener('click', () =>  openEditTaskModal(task));
      tasksContainer.appendChild(taskElement);
    });
  });
}


function refreshTasksUI() {
  filterAndDisplayTasksByBoard(activeBoard);
}

// Styles the active board by adding an active class
// TASK: Fix Bugs
function styleActiveBoard(boardName) {
  document.querySelectorAll('.board-btn').forEach(btn => { 
    btn.classList.toggle('active', btn.textContent === boardName);
  });
}


function addTaskToUI(task) {
  const column = document.querySelector(`.column-div[data-status="${task.status}"]`);
  if (!column) {
    console.error(`Column not found for status: ${task.status}`);
    return;
  }

  let tasksContainer = column.querySelector('.tasks-container');
  if (!tasksContainer) {
    //console.warn(`Tasks container not found for status: ${task.status}, creating one.`);
    tasksContainer = document.createElement('div');
    tasksContainer.classList.add('tasks-container');
    column.appendChild(tasksContainer);
  }

  const taskElement = document.createElement('div');
  taskElement.classList.add('task-div');
  taskElement.textContent = task.title; // Modify as needed
  taskElement.setAttribute('data-task-id', task.id);
  taskElement.addEventListener('click', () => openEditTaskModal(task));
  tasksContainer.appendChild(taskElement); //added taskElement 
}



function setupEventListeners() {
  // Cancel editing task event listener
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  cancelEditBtn.addEventListener('click', () => toggleModal(false, elements.editTaskModal)); //added event listener

  // Cancel adding new task event listener
  const cancelAddTaskBtn = document.getElementById('cancel-add-task-btn');
  cancelAddTaskBtn.addEventListener('click', () => {
    toggleModal(false);
    elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
  });

  // Clicking outside the modal to close it
  elements.filterDiv.addEventListener('click', () => {
    toggleModal(false);
    elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
  });

  // Show sidebar event listener
  elements.hideSidebarBtn.addEventListener('click',() => toggleSidebar(false)); //added El
  elements.showSidebarBtn.addEventListener('click',() => toggleSidebar(true)); // added EL

  // Theme switch event listener
  elements.themeToggle.addEventListener('change', toggleTheme); // ADDED TOGGLE instead of switch

  // Show Add New Task Modal event listener
  elements.addNewTaskBtn.addEventListener('click', () => {
    toggleModal(true);
    elements.filterDiv.style.display = 'block'; // Also show the filter overlay
  });

  // Add new task form submission event listener
  elements.modalWindow.addEventListener('submit', event => {
    event.preventDefault();
    addTask(event);
  });
}

// Toggles tasks modal
// Task: Fix bugs
function toggleModal(show, modal = elements.modalWindow) {
  modal.style.display = show ? 'block' : 'none'; // added :
}

/*************************************************************************************************************************************************
 * COMPLETE FUNCTION CODE
 * **********************************************************************************************************************************************/

function addTask(event) {
  event.preventDefault(); 

  //THIS IS to add new TASK INPUTS
  //Assign user input to the task object
  const task = {
    title: elements.titleInput.value,
    description: elements.descInput.value,
    status: elements.selectStatus.value,
    id: Date.now(),
    board: activeBoard,
  };

  const newTask = createNewTask(task);
  if (newTask) {
    addTaskToUI(newTask);
    toggleModal(false);
    elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
    event.target.reset();
    refreshTasksUI();
  };
}
   

function toggleSidebar(show) {
  elements.sidebar.style.display = show ? 'block' : 'none'; 
  elements.showSidebarBtn.style.display = show ? 'none' : 'block';
  localStorage.setItem('showSideBar', String(show));
}



function toggleTheme() {
  const isLightTheme = document.body.classList.toggle('light-theme');
  localStorage.setItem('light-theme', isLightTheme ? 'enabled' : 'disabled');
}

function openEditTaskModal(task) {
  // Set task details in modal inputs
  elements.editTaskModal.style.display = 'block';
  elements.editTaskTitleInput.value = task.title;
  elements.editTaskDescInput.value = task.description;
  elements.editSelectStatus.value = task.status;

  // Get button elements from the task modal
  const saveChangesBtn = elements.editTaskModal.querySelector('#save-task-changes-btn');
  const deleteTaskBtn = elements.editTaskModal.querySelector('#delete-task-btn'); 

  const newSaveBtn = saveChangesBtn.cloneNode(true);
  saveChangesBtn.replaceWith(newSaveBtn);

  // Call saveTaskChanges upon click of Save Changes button
  newSaveBtn.addEventListener('click', () => saveTaskChanges(task.id));
 

  // Delete task using a helper function and close the task modal
  deleteTaskBtn.onclick = () => {
    deleteTask(task.id);
    refreshTasksUI();
    elements.editTaskModal.style.display = 'block';
  };

  toggleModal(true, elements.editTaskModal); // Show the modal
}

function saveTaskChanges(taskId) {
  // Get new user inputs
  const updatedTask = {
    id: taskId,
    title: elements.editTaskTitleInput.value.trim(),  // Trim to remove any extra spaces
    description: elements.editTaskDescInput.value.trim(),
    status: elements.editSelectStatus.value
  };

  // Create an object with the updated task details
  if (!updatedTask.title) {
    alert('Task title cannot be empty!');
    return;
  }



  // Update task using a hlper functoin
  patchTask(updatedTask);


  // Close the modal and refresh the UI to reflect the changes
  toggleModal(false, elements.editTaskModal);
  refreshTasksUI();
}


/*************************************************************************************************************************************************/

document.addEventListener('DOMContentLoaded', function() {
  init(); // init is called after the DOM is fully loaded
});

function init() {
  setupEventListeners();
  const showSidebar = localStorage.getItem('showSideBar') === 'true';
  toggleSidebar(showSidebar);
  const isLightTheme = localStorage.getItem('light-theme') === 'enabled';
  document.body.classList.toggle('light-theme', isLightTheme);
  fetchAndDisplayBoardsAndTasks(); // Initial display of boards and tasks
}