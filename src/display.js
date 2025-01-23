import { getProjects, getProjectFromName, getActiveProject } from "./logic";
import { getCurrentDate } from "./date.js";

const dom = (function () {
  const container = get(".container");
  const sidebar = get(".sidebar");
  const projectList = get(".project-list");
  const headerDate = get(".sidebar-date");
  const headerDay = get(".sidebar-day");
  function get(element) {
    return document.querySelector(element)
  }
  function make(tag, textContent) {
    const element = document.createElement(tag);
    if (textContent) element.textContent = textContent;
    return element;
  }
  return { make, container, sidebar, projectList, headerDate, headerDay };
})();

// Sidebar //

export function listProjects() {
  const projects = getProjects();
  for (const project of projects) {
    const li = dom.make("li", project.name)
    dom.projectList.appendChild(li);
  }
}

export function displayDate() {
  dom.headerDay.textContent = `${getCurrentDate.weekday()}`;
  dom.headerDate.textContent = `${getCurrentDate.month()} ${getCurrentDate.day()} ${getCurrentDate.year()}`;
}

// Container //

export function displayFoldersOf(project) {
  const activeProject = getProjectFromName(project);
  for (const folder of activeProject.folders) {
    const card = dom.make("div");
    card.classList.add("folder-container");
    const cardFolders = dom.make("div");
    cardFolders.classList.add("folder");
    const cardTitle = dom.make("h1", folder.name);
    displayTodosOf(folder.todos, cardFolders);
    card.append(cardTitle, cardFolders);
    dom.container.appendChild(card);
  }
}

// Todos //

function displayTodosOf(folderTodos, domElement) {
  const activeFolder = folderTodos;
  for (const todo of activeFolder) {
    const card = dom.make("div");
    card.classList.add("todo-container");
    const todoBox = dom.make("div", todo.name);
    todoBox.classList.add("todo-box");
    todoBox.addEventListener("mousedown", (event) => todoDragging(event, todoBox));
    card.append(todoBox);
    domElement.appendChild(card);
  }
  const cardFooter = dom.make("div");
  const cardFooterText = dom.make("h2", "+");
  cardFooter.classList.add("todo-add-button");
  cardFooter.appendChild(cardFooterText);
  domElement.appendChild(cardFooter);
}

// Todo Dragging //

function todoDragging(event, element) {
  event.preventDefault();
  element.id = "dragging";
  document.onmousemove = dragElement;
  document.onmouseup = closeDragElement;

  function dragElement(e) {
    const elementWidth = element.clientWidth;
    const elementHeight = element.clientHeight;
    document.body.style.cursor = "grabbing";
    element.style.setProperty("--mouse-x", `${e.clientX - elementWidth / 2}px`)
    element.style.setProperty("--mouse-y", `${e.clientY - elementHeight / 2}px`)
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
    element.id = "";
    document.body.style.cursor = "default";
  }

}