import { getFolders, newFolder, taskToFolder, getTasks, newTask } from "./tasks-handler.js";
import { elements } from "./dom-interface.js";
import { getCurrentDate } from "./date-handler.js";
import { showModal } from "./form-handler.js";


export function refreshSidebar() {

  const taskList = document.querySelector(".task-list");
  clearChildrenOf(taskList);
  for (const task of getTasks()) {
    const taskItem = document.createElement("li");
    taskItem.textContent = task.title;
    taskList.appendChild(taskItem);
  }
  for (const folder of getFolders()) {
    const folderItem = document.createElement("li");
    folderItem.textContent = folder.title;
    const folderTasks = document.createElement("ul");
    folderItem.appendChild(folderTasks);
    for (const folderTask of folder.tasks) {
      const taskChild = document.createElement("li");
      taskChild.textContent = folderTask.title;
      folderTasks.appendChild(taskChild);
    }
    taskList.appendChild(folderItem);
  }
  // refreshInputs();
  // console.log(getTasks());
  // console.log(getFolders());
}

export function displayDate() {
  const headerDate = elements.sidebar.headerDate;
  const headerDay = elements.sidebar.headerDay;
  headerDay.textContent = `${getCurrentDate.weekday()}`;
  headerDate.textContent = `${getCurrentDate.month()} ${getCurrentDate.day()} ${getCurrentDate.year()}`;
}

export function refreshContainer() {

}

function clearChildrenOf(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}


elements.sidebar.addTaskButton.addEventListener("click", () => {
  showModal();
})

// function refreshInputs() {
//   const taskSelect = document.querySelector("#task-select");
//   while (taskSelect.firstChild) {
//     taskSelect.removeChild(taskSelect.firstChild);
//   }
//   for (const task of getTasks()) {
//     const taskValue = document.createElement("option");
//     taskValue.textContent = task.title;
//     taskValue.setAttribute("value", task.title);
//     taskValue.setAttribute("data-index-task", getTasks().indexOf(task))
//     taskSelect.appendChild(taskValue);
//   }
//   const folderSelect = document.querySelector("#folder-select");
//   while (folderSelect.firstChild) {
//     folderSelect.removeChild(folderSelect.firstChild);
//   }
//   for (const folder of getFolders()) {
//     const folderValue = document.createElement("option");
//     folderValue.textContent = folder.name;
//     folderValue.setAttribute("value", folder.name);
//     folderValue.setAttribute("data-index-folder", getFolders().indexOf(folder))
//     folderSelect.appendChild(folderValue);
//   }
// }

// const taskToFolderButton = document.querySelector(".task-to-folder-button");

// taskToFolderButton.addEventListener("click", () => {
//   const taskSelect = document.querySelector("#task-select");
//   const taskOptions = taskSelect.options[taskSelect.selectedIndex];
//   const taskIndex = taskOptions.getAttribute("data-index-task");

//   const folderSelect = document.querySelector("#folder-select");
//   const folderOptions = folderSelect.options[folderSelect.selectedIndex];
//   const folderIndex = folderOptions.getAttribute("data-index-folder");

//   console.log({ taskIndex, folderIndex });
//   taskToFolder(taskIndex, folderIndex);

//   refreshList()

// });

// const addTaskButton = document.querySelector(".add-task-button");

// addTaskButton.addEventListener("click", () => {
//   const taskPrompt = prompt("Add new task");
//   if (taskPrompt) {
//     newTask(taskPrompt);
//     refreshList()
//   }
// });

// const addFolderButton = document.querySelector(".add-folder-button");

// addFolderButton.addEventListener("click", () => {
//   const folderPrompt = prompt("Add new folder");
//   if (folderPrompt) {
//     newFolder(folderPrompt);
//     refreshList()
//   }
// });