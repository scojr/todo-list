import { getFolders, newFolder, taskToFolder, getTasks, newTask } from "./tasks-handler.js";
import { elements, clearChildrenOf } from "./dom-interface.js";
import { tasksByDate } from "./date-handler.js";
import { showModal } from "./form-handler.js";

// export function refreshContainer(array, cardContainer) {
//   const container = cardContainer;
//   clearChildrenOf(container);
//   for (const folder of getFolders()) {
//     const folderCard = document.createElement("div");
//     const folderCardTitle = document.createElement("h2");
//     const folderCardTaskList = document.createElement("ul");
//     folderCardTitle.textContent = folder.title;
//     for (const task of folder.tasks) {
//       const folderCardTaskItem = document.createElement("li");
//       folderCardTaskItem.textContent = task.title;
//       folderCardTaskList.appendChild(folderCardTaskItem);
//     }
//     folderCard.append(folderCardTitle, folderCardTaskList);
//     container.appendChild(folderCard);
//   }
// }

export function refreshContainer(array, cardContainer) {
  const container = cardContainer;
  const tasks = array;
  const folderCards = [];
  clearChildrenOf(container);
  for (const task of tasks) {
    if (task.folder && !folderCards.includes(task.folder.title)) {
      folderCards.push(task.folder.title);
      var folderCard = document.createElement("div");
      var folderCardTitle = document.createElement("h2");
      folderCardTitle.textContent = task.folder.title;
    }
    const folderCardTaskList = document.createElement("ul");
    const taskItem = document.createElement("li");
    taskItem.textContent = task.title;
    folderCardTaskList.appendChild(taskItem);
    folderCard.append(folderCardTitle, folderCardTaskList);
    container.appendChild(folderCard);
  }
}

refreshContainer(tasksByDate().week, elements.container.weekCard);
refreshContainer(tasksByDate().today, elements.container.todayCard);
refreshContainer(tasksByDate().month, elements.container.upcomingCard);
