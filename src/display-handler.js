import { getTasks, newTask } from "./tasks-handler";

export function refreshList() {
  const taskList = document.querySelector(".task-list");
  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }
  for (const task of getTasks()) {
    const taskItem = document.createElement("li");
    taskItem.textContent = task.title;
    taskList.appendChild(taskItem);
  }
}

const addTaskButton = document.querySelector(".add-task-button");

addTaskButton.addEventListener("click", () => {
  const taskPrompt = prompt("Add new task");
  if (taskPrompt) {
    newTask(taskPrompt);
    refreshList()
  }
});