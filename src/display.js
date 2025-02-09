import { controller } from "./logic";
import { dom } from "./dom-interface";
import { getCurrentDate } from "./date.js";
import { enableDragAndDrop } from "./drag-and-drop.js";
import chevron from "./icons/chevron-down.svg";
import edit from "./icons/edit.svg";
import plus from "./icons/plus.svg";

function makeCard(object) {
  const container = dom.make("div");
  const myIndex = object.parentObject.children.indexOf(object);
  container.dataset.index = myIndex;
  const objectType = object.constructor.name.toLowerCase()
  container.dataset.type = objectType;
  container.style.setProperty("order", myIndex);
  container.classList.add(objectType);
  const header = dom.make("div");
  enableDragAndDrop(header);
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
  dom.projectTitle.textContent = controller.getActiveProject().title;
  dom.projectDescription.textContent = controller.getActiveProject().description;
  displayTablesOf(controller.getActiveProject());
}

// Header //
export function displayHeader() {
  const projects = controller.getProjects();
  for (const project of projects) {
    const li = dom.make("li", project.title);
    if (project === controller.getActiveProject()) li.classList.add("active-project");
    dom.projectList.appendChild(li);
    dom.headerDay.textContent = `${getCurrentDate.weekday()}`;
    dom.headerDate.textContent = `${getCurrentDate.month()} ${getCurrentDate.day()} ${getCurrentDate.year()}`;
  }
  const collapseButton = dom.make("button");
  const collapseIcon = dom.make("img");
  collapseIcon.src = chevron;
  collapseIcon.width = 24;
  collapseIcon.height = 24;
  collapseButton.appendChild(collapseIcon);
  dom.projectList.appendChild(collapseButton);
}

// Container //

function displayTablesOf(project) {
  for (const table of project.children) {
    const tableContainer = makeCard(table);
    tableContainer.querySelector(".table-header").appendChild(appendButtons())
    const taskContainer = dom.make("div");
    taskContainer.classList.add("task-container")
    for (const task of table.children) {
      const newTask = makeCard(task);
      taskContainer.appendChild(newTask);

    }
    tableContainer.appendChild(taskContainer);
    if (table.color) setTableColor(table, tableContainer);
    dom.container.appendChild(tableContainer);
  };
}

function setTableColor(object, element) {
  const color = object.color;
  element.querySelector(".table-header").style.setProperty("background-color", color);
}

function appendButtons() {
  const buttons = dom.make("div");
  buttons.classList.add("table-buttons");

  const addButton = dom.make("button");
  addButton.classList.add("add-button");
  const addIcon = dom.make("img");
  addIcon.src = plus;
  addIcon.width = 24;
  addIcon.height = 24;
  addButton.appendChild(addIcon);

  const editButton = dom.make("button");
  editButton.classList.add("edit-button");
  const editIcon = dom.make("img");
  editIcon.src = edit;
  editIcon.width = 24;
  editIcon.height = 24;
  editButton.appendChild(editIcon);

  buttons.append(editButton, addButton);

  return buttons;
}