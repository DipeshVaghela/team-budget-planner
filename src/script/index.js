// All styles imports
import "../style/index.css";
import deleteIcon from "../img/trash-fill.svg";

// Global variables
var totalBudget = 0;
var totalDuration = 0;
var totalPeople = 0;
var taskList = [];

// DOM Elements
var taskNameElement = document.getElementById("task-name");
var taskDurationElement = document.getElementById("task-duration");
var taskRateElement = document.getElementById("task-rupees-per-duration-rate");
var taskPeopleElement = document.getElementById("task-no-of-people-involved");
var taskTableBody = document.getElementById("task-table-body");
var budgetInfo = document.getElementById("budget-info");
budgetInfo.style.display = "none";
var totalBudgetElement = document.getElementById("total-budget");
var totalDurationElement = document.getElementById("total-duration");
var totalPeopleElement = document.getElementById("total-people");

// Display locally stored task
const data = new Promise((resolve, reject) => {
  if (localStorage.getItem("taskList") != null) {
    taskList = JSON.parse(localStorage.getItem("taskList"));
    resolve(taskList);
  } else {
    reject("No task is there");
  }
});

data
  .then((taskList) => {
    taskList.forEach((task) => {
      addTaskToTable(task);
      calculateBudget(task);
    });
    toggleBudgetInfo();
  })
  .catch((message) => {
    console.log(message);
  });

// Class for task
class Task {
  constructor(id, taskName, taskDuration, taskRate, taskPeople) {
    this.id = id;
    this.taskName = taskName;
    this.taskDuration = taskDuration;
    this.taskRate = taskRate;
    this.taskPeople = taskPeople;
  }
}

// function to generate unique task id
function getUniqueId() {
  return Math.random().toString(36).substring(2);
}

// Calculate budget
function calculateBudget(task) {
  totalDuration += task.taskDuration;
  totalPeople += task.taskPeople;
  totalBudget = totalBudget + task.taskRate * task.taskDuration;
}
// To toggle budget info
function toggleBudgetInfo() {
  if (taskList.length !== 0) {
    budgetInfo.style.display = "flex";
    totalBudgetElement.innerHTML = totalBudget + " &#8377;";
    totalDurationElement.innerText = totalDuration + " hours";
    totalPeopleElement.innerText = totalPeople;
  } else {
    budgetInfo.style.display = "none";
  }
}

function addTask(event) {
  event.preventDefault();

  let taskName = taskNameElement.value;
  let taskDuration = parseFloat(taskDurationElement.value);
  let taskRate = parseFloat(taskRateElement.value);
  let taskPeople = parseInt(taskPeopleElement.value);

  document.getElementById("add-task-form").reset();

  const task = new Task(
    getUniqueId(),
    taskName,
    taskDuration,
    taskRate,
    taskPeople
  );

  calculateBudget(task);
  taskList.push(task);
  localStorage.setItem("taskList", JSON.stringify(taskList));
  (function () {
    addTaskToTable(task);
    toggleBudgetInfo();
  })();
}

async function addTaskToTable(task) {
  let newTableRow = document.createElement("tr");
  newTableRow.id = task.id;
  newTableRow.innerHTML =
    `<td>` +
    task.taskName +
    `</td>` +
    `<td>` +
    task.taskDuration +
    ` hours` +
    "</td>" +
    `<td>` +
    task.taskRate +
    ` &#8377;/hours` +
    `</td>` +
    `<td>` +
    task.taskPeople +
    `</td>` +
    `<td><img src="${deleteIcon}" alt="not found" onclick="deleteTask('${task.id}')"/>` +
    `</td>`;

  taskTableBody.appendChild(newTableRow);
}

async function deleteTask(id) {
  let task;
  taskList.forEach((eachTask) => {
    if (eachTask.id == id) task = eachTask;
  });
  totalDuration -= task.taskDuration;
  totalPeople -= task.taskPeople;
  totalBudget -= task.taskRate * task.taskDuration;
  taskList = taskList.filter((eachTask) => {
    return eachTask.id != task.id;
  });

  if (taskList.length == 0) {
    localStorage.removeItem("taskList");
  } else {
    localStorage.setItem("taskList", JSON.stringify(taskList));
  }
  toggleBudgetInfo();
  let deleteElement = document.getElementById(task.id);
  taskTableBody.removeChild(deleteElement);
}

window.getUniqueId = getUniqueId;
window.toggleBudgetInfo = toggleBudgetInfo;
window.calculateBudget = calculateBudget;
window.addTask = addTask;
window.addTaskToTable = addTaskToTable;
window.deleteTask = deleteTask;
