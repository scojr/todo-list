import { controller } from "./logic";
import { dom } from "./dom-interface";
import { getCurrentDate } from "./date.js";
import { enableDragAndDrop } from "./drag-and-drop.js";
import { addFormEventListeners } from "./form.js";
import chevron from "./icons/chevron-down.svg";
import plus from "./icons/plus.svg";
import palette from "./icons/color.svg";
import edit from "./icons/edit.svg";


function makeCard(object) {
  controller.saveToLocalStorage();
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
  addFormEventListeners();
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
  collapseIcon.src = plus;
  collapseIcon.width = 24;
  collapseIcon.height = 24;
  collapseButton.appendChild(collapseIcon);
  dom.projectList.appendChild(collapseButton);
}

// Container //

function displayTablesOf(project) {
  for (const table of project.children) {
    const tableContainer = makeCard(table);
    tableContainer.querySelector(".table-header").appendChild(appendButtons(table.color));
    const taskContainer = dom.make("div");
    taskContainer.classList.add("task-container");
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

function appendButtons(color) {
  const buttons = dom.make("div");
  buttons.classList.add("table-buttons");

  const editButton = dom.make("button");
  editButton.classList.add("edit-button");
  const addIcon = dom.make("img");
  addIcon.src = edit;
  addIcon.width = 24;
  addIcon.height = 24;
  editButton.appendChild(addIcon);



  const colorIcon = dom.make("img");
  colorIcon.classList.add("color-icon");
  colorIcon.src = palette;
  colorIcon.width = 24;
  colorIcon.height = 24;

  const colorInput = dom.make("input");
  colorInput.type = "color";
  colorInput.classList.add("color-input");
  colorInput.value = color;

  const colorInputContainer = dom.make("div");
  colorInputContainer.classList.add("color-input-container");
  colorInputContainer.append(colorInput, colorIcon);

  buttons.append(colorInputContainer, editButton);

  return buttons;
}