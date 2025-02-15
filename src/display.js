import { controller } from "./logic";
import { dom } from "./dom-interface";
import { getCurrentDate } from "./date.js";
import { enableDragAndDrop } from "./drag-and-drop.js";
import { addFormEventListeners } from "./form.js";
import { newProjectClick } from "./form.js";
import plus from "./icons/plus.svg";
import palette from "./icons/color.svg";
import edit from "./icons/edit.svg";
import plusTask from "./icons/plus-task.svg"


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
  while (dom.container.lastElementChild) {
    dom.container.removeChild(dom.container.lastElementChild);
  }
  display();
}

export function display() {
  console.log("----Active Project----")
  console.log(controller.getActiveProject())
  console.log("----------------------")
  dom.projectTitle.textContent = controller.getActiveProject().title;
  dom.projectDescription.textContent = controller.getActiveProject().description;
  displayTablesOf(controller.getActiveProject());
  addFormEventListeners();
}

// Header //
export function refreshHeader() {
  while (dom.projectList.lastElementChild) {
    dom.projectList.removeChild(dom.projectList.lastElementChild);
  }
  displayHeader();
}

export function displayHeader() {
  dom.headerDay.textContent = `${getCurrentDate.weekday()}`;
  dom.headerDate.textContent = `${getCurrentDate.month()} ${getCurrentDate.day()} ${getCurrentDate.year()}`;
  const projects = controller.getProjects();
  for (const project of projects) {
    const li = dom.make("li", project.title);
    li.dataset.index = projects.indexOf(project);
    li.classList.add("header-project-button");
    li.addEventListener("click", () => {
      changeActiveProject(li.dataset.index)
    });
    if (project === controller.getActiveProject()) li.classList.add("active-project");
    dom.projectList.appendChild(li);
  }
  const addProjectButton = dom.make("button");
  addProjectButton.classList.add("add-project-button");
  addProjectButton.addEventListener("click", newProjectClick)
  const addProjectIcon = dom.make("img");
  addProjectIcon.src = plus;
  addProjectIcon.width = 24;
  addProjectIcon.height = 24;
  addProjectButton.appendChild(addProjectIcon);
  dom.projectList.appendChild(addProjectButton);
}

function changeActiveProject(index) {
  controller.setActiveProject(index);
  resetDisplay();
  refreshHeader();
}

// Container //

function displayTablesOf(project) {
  for (const table of project.children) {
    const tableContainer = makeCard(table);
    const tableColor = table.color;
    tableContainer.querySelector(".table-header").appendChild(appendButtons(tableColor));
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
  const editIcon = dom.make("img");
  editIcon.src = edit;
  editIcon.width = 24;
  editIcon.height = 24;
  editButton.title = "Edit Title";
  editButton.appendChild(editIcon);

  const colorIcon = dom.make("img");
  colorIcon.classList.add("color-icon");
  colorIcon.src = palette;
  colorIcon.width = 24;
  colorIcon.height = 24;

  const colorInput = dom.make("input");
  colorInput.type = "color";
  colorInput.classList.add("color-input");
  colorInput.value = color;
  colorInput.title = "Edit Color";

  const colorInputContainer = dom.make("div");
  colorInputContainer.classList.add("color-input-container");
  colorInputContainer.append(colorInput, colorIcon);

  const addTaskButton = dom.make("button");
  addTaskButton.classList.add("add-task-button");
  const addTaskIcon = dom.make("img");
  addTaskIcon.src = plusTask;
  addTaskIcon.width = 24;
  addTaskIcon.height = 24;
  addTaskButton.append(addTaskIcon);
  addTaskButton.title = "Add Task";

  buttons.append(colorInputContainer, editButton, addTaskButton);

  return buttons;
}