import { getFolders, newFolder, getTasks, newTask } from "./tasks-handler.js";

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

  const folderList = document.querySelector(".folder-list");
  while (folderList.firstChild) {
    folderList.removeChild(folderList.firstChild);
  }
  for (const folder of getFolders()) {
    const folderItem = document.createElement("li");
    folderItem.textContent = folder.title;
    folderList.appendChild(folderItem);
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

const addFolderButton = document.querySelector(".add-folder-button");

addFolderButton.addEventListener("click", () => {
  const folderPrompt = prompt("Add new folder");
  if (folderPrompt) {
    newFolder(folderPrompt);
    refreshList()
  }
});