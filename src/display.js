import { controller } from "./logic";
import { dom } from "./dom-interface";
import { getCurrentDate } from "./date.js";
import { enableDragAndDrop } from "./drag-and-drop.js";
// import chevron from "./icons/chevron-down.svg";
// import dragHorizontal from "./icons/drag-horizontal.svg";

function makeCard(object) {
  const container = dom.make("div");
  const myIndex = object.parentObject.children.indexOf(object);
  container.dataset.index = myIndex;
  const objectType = object.constructor.name.toLowerCase()
  container.dataset.type = objectType;
  container.style.setProperty("order", myIndex);
  container.classList.add(objectType);
  const header = dom.make("div");
  header.classList.add(objectType + "-header");
  const title = dom.make("h2", object.title);
  header.appendChild(title);
  container.appendChild(header);
  return container;
}

export function resetDisplay() {
  console.log("----Active Project----")
  console.log(controller.getActiveProject())
  console.log("----------------------")
  while (dom.container.lastElementChild) {
    dom.container.removeChild(dom.container.lastElementChild);
  }
  displayTablesOf(controller.getActiveProject());
}

// Header //
export function displayHeader() {
  const projects = controller.getProjects();
  for (const project of projects) {
    const li = dom.make("li", project.title);
    const stylingSpan = dom.make("span");
    li.appendChild(stylingSpan);
    dom.projectList.appendChild(li);
    dom.headerDay.textContent = `${getCurrentDate.weekday()}`;
    dom.headerDate.textContent = `${getCurrentDate.month()} ${getCurrentDate.day()} ${getCurrentDate.year()}`;
  }
}

// Container //
displayTablesOf(controller.getActiveProject())

function displayTablesOf(project) {
  for (const table of project.children) {
    const tableContainer = makeCard(table);
    enableDragAndDrop(tableContainer);
    const taskContainer = dom.make("div");
    taskContainer.classList.add("task-container")
    for (const task of table.children) {
      const newTask = makeCard(task);
      enableDragAndDrop(newTask);
      taskContainer.appendChild(newTask);

    }
    tableContainer.appendChild(taskContainer);
    dom.container.appendChild(tableContainer);
  };
}