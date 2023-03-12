// Select elements
const input = document.querySelector(".input");
const checkboxes = document.querySelectorAll(".checkbox");
let tasks = document.querySelector(".tasks");
const totalTasks = document.querySelector(".total__tasks");
const doneTasks = document.querySelector(".done__tasks");
let taskElements = document.querySelectorAll(".task");
const clearBtn = document.querySelector(".clear-btn");
//
clearBtn.classList.add("hidden");

let tasksArr = [];

// Check if there tasks in the local storage
if (window.localStorage.getItem("tasks"))
  tasksArr = JSON.parse(window.localStorage.getItem("tasks"));

//
if (window.localStorage.getItem("total"))
  totalTasks.innerHTML = JSON.parse(window.localStorage.getItem("total"));

//
if (window.localStorage.getItem("done"))
  doneTasks.innerHTML = JSON.parse(window.localStorage.getItem("done"));

// Get the data from locale Storage fn
getDataFromStorage();

// Add Task
document.addEventListener("keydown", (e) => {
  // Check
  if (e.key === "Enter" && input.value !== "") {
    addTaskToArray(input.value);

    // Clear input field
    input.value = "";
  }
});

//
function addTaskToArray(taskText) {
  // Task Data Obj
  const task = {
    id: Date.now(),
    title: taskText,
    done: false,
  };

  // Push the task obj to the tasks Array
  tasksArr.push(task);

  // Add tasks to the page
  addElement(tasksArr);

  // Add tasks to the local storage
  setData(tasksArr);
}

// ^
function addElement(tasksArr) {
  //
  tasks.innerHTML = "";
  //

  let hash, wordBefore, wordAfter;
  tasksArr.forEach((task) => {
   if (task.title.includes("#")) {
      hash = task.title.split(" ").find((s) => s.includes("#"));
      wordBefore = task.title.slice(0, task.title.indexOf(hash));
      wordAfter = task.title.slice(task.title.indexOf(hash) + hash.length);
    }
    else {
      wordBefore = task.title;
      hash = false || "";
      wordAfter = false || "";
    }

    tasks.innerHTML += `<li class="task ${
      task.done ? "done" : "no"
    }" data-id ="${task.id}">
                      <div class="checkbox"></div>
                      <p class = 'word'>${wordBefore}<span class="hash" >${hash}</span>${wordAfter}</p>
                      </li>`;
  });
}

tasks.addEventListener("dblclick", (event) => {
  if (event.target.classList.contains("checkbox")) {
    // remove the task element from the page
    event.target.parentElement.remove();
    // remove the task element from local storage
    deleteTask(event.target.parentElement.getAttribute("data-id"));
  }
});

tasks.addEventListener("click", (event) => {
  event.preventDefault();
  if (event.target.classList.contains("checkbox")) {
    // Toggle done tasks
    toggleTasks(event.target.parentElement.getAttribute("data-id"));
    // Toggle done class
    event.target.parentElement.classList.toggle("done");
  }
  if (event.target.classList.contains("hash")) {
    // remove all task elemente from the page except of the hash woords
    taskElements = document.querySelectorAll(".task");
    [...taskElements].forEach((taskEl) => {
      if (!taskEl.innerText.split(" ").includes(event.target.textContent))
        taskEl.style.display = "none";
    });

    clearBtn.classList.remove("hidden");
  }

  if (event.target.classList.contains("clear-btn")) {
    taskElements.forEach((taskEL) => (taskEL.style.display = "flex"));
    // remove the task element from the page
    event.target.classList.add("hidden");
  }
});

function setData(tasksArr) {
  window.localStorage.setItem("tasks", JSON.stringify(tasksArr));

  // count total tasks
  window.localStorage.setItem("total", tasksArr.length);
  if (window.localStorage.getItem("total"))
    totalTasks.innerHTML = window.localStorage.getItem("total");

  // Count the done tasks
  doneTasksCount = tasksArr.filter((task) => task.done === true).length;
  window.localStorage.setItem("done", JSON.stringify(doneTasksCount));
  if (window.localStorage.getItem("done"))
    doneTasks.innerHTML = window.localStorage.getItem("done");
}

function getDataFromStorage() {
  let data = window.localStorage.getItem("tasks");
  if (data) {
    let tasks = JSON.parse(data); // Array
    addElement(tasks);
  }
}

function deleteTask(taskId) {
  // Return all tasks EXCEPT of the taskId one
  tasksArr = tasksArr.filter((task) => task.id !== +taskId);
  setData(tasksArr);
}

function toggleTasks(taskId) {
  for (const task of tasksArr) {
    if (task.id == taskId)
      task.done === false ? (task.done = true) : (task.done = false);
  }
  setData(tasksArr);
}
