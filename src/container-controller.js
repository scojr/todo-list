import { getFolders, newFolder, taskToFolder, getTasks, newTask } from "./tasks-handler.js";
import { elements, clearChildrenOf } from "./dom-interface.js";
import { getCurrentDate } from "./date-handler.js";
import { showModal } from "./form-handler.js";

export function refreshContainer(cardContainer) {
  const container = cardContainer;
  clearChildrenOf(container);
  for (const folder of getFolders()) {
    const folderCard = document.createElement("div");
    const folderCardTitle = document.createElement("h2");
    const folderCardTaskList = document.createElement("ul");
    folderCardTitle.textContent = folder.title;
    for (const task of folder.tasks) {
      const folderCardTaskItem = document.createElement("li");
      folderCardTaskItem.textContent = task.title;
      folderCardTaskList.appendChild(folderCardTaskItem);
    }
    folderCard.append(folderCardTitle, folderCardTaskList);
    container.appendChild(folderCard);
  }
}