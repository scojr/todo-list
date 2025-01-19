import { getFolders, newFolder, taskToFolder, getTasks, newTask } from "./tasks-handler.js";
import { elements, clearChildrenOf } from "./dom-interface.js";
import { getCurrentDate } from "./date-handler.js";
import { showModal } from "./form-handler.js";


export function refreshSidebar() {
  const taskList = elements.sidebar.taskList;
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
}

export function displayDate() {
  const headerDate = elements.sidebar.headerDate;
  const headerDay = elements.sidebar.headerDay;
  headerDay.textContent = `${getCurrentDate.weekday()}`;
  headerDate.textContent = `${getCurrentDate.month()} ${getCurrentDate.day()} ${getCurrentDate.year()}`;
}

elements.sidebar.addTaskButton.addEventListener("click", () => {
  showModal();
})