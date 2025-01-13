import "./style.css";

const tasks = [];

const taskList = document.querySelector(".task-list");

class Task {
  constructor(objective, details, deadline) {
    this.title = objective;
    this.details = details;
    this.date = deadline;
  }
}

function listTasks() {
  return tasks;
}

function newTask(objective, details, deadline) {
  const task = new Task(objective, details, deadline);
  tasks.push(task);
}

newTask("clean room", "clean up my roomn", "tonight");
console.log(listTasks());


function refreshList() {
  for (const task of tasks) {
    const taskItem = document.createElement("li");
    taskItem.textContent = task.title;
    taskList.appendChild(taskItem);
  }
}

refreshList()