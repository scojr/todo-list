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
  const activeProject = getActiveProject();
  for (const folder of activeProject.folders) {
    const card = dom.make("div");
    card.classList.add("folder-container");
    const cardFolders = dom.make("div");
    cardFolders.classList.add("folder");
    cardFolders.setAttribute("data-index", activeProject.folders.indexOf(folder));
    const cardTitle = dom.make("h1", folder.name);
    displayTodosOf(folder.todos, cardFolders);
    card.append(cardTitle, cardFolders);
    dom.container.appendChild(card);
  }
}

function clearInterface() {
  while (dom.container.lastElementChild) {
    dom.container.removeChild(dom.container.lastElementChild);
  }
}

// Todos //

function displayTodosOf(folderTodos, domElement) {
  const activeFolder = folderTodos;
  for (const todo of activeFolder) {
    const card = dom.make("div");
    card.classList.add("todo-container");
    card.style.order = activeFolder.indexOf(todo);
    const todoBox = dom.make("div", todo.name);
    todoBox.classList.add("todo-box");
    todoBox.setAttribute("data-index", activeFolder.indexOf(todo));
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
  const draggedClonedElement = element.cloneNode(true);
  draggedClonedElement.id = "dragging";
  draggedClonedElement.setAttribute("data-index", "null");
  const folderClonedElement = element.parentElement.cloneNode(true);
  folderClonedElement.id = "folder-cloned-element"
  document.onmousemove = dragElement;
  document.onmouseup = closeDragElement;
  var activeFolders = document.querySelectorAll(".folder")

  function dragElement(e) {
    element.parentElement.style.visibility = "collapse";
    element.parentElement.style.position = "absolute";
    const elementWidth = draggedClonedElement.clientWidth;
    const elementHeight = draggedClonedElement.clientHeight;
    document.body.style.cursor = "grabbing";
    draggedClonedElement.style.setProperty("--mouse-x", `${e.clientX - elementWidth / 2}px`)
    draggedClonedElement.style.setProperty("--mouse-y", `${e.clientY + elementHeight / 2}px`)
    dom.container.appendChild(draggedClonedElement);
    for (const folder of activeFolders) {
      folder.addEventListener("mouseenter", folderMouseEnter);
      folder.addEventListener("mouseleave", folderMouseLeave);
      for (const todo of folder.querySelectorAll(".todo-box:not(#folder-cloned-element)")) {
        todo.addEventListener("mouseover", taskMouseEnter)
      }
    }
  }

  function taskMouseEnter(e) {
    let indexOfHoveredTask = e.srcElement.attributes[1].nodeValue;
    if (indexOfHoveredTask) {
      folderClonedElement.style.order = (indexOfHoveredTask - 1);
    }
  }

  function folderMouseEnter(e) {
    console.log(e.srcElement);
    e.srcElement.appendChild(folderClonedElement);
  }

  function folderMouseLeave(e) {
    folderClonedElement.remove();
  }

  function closeDragElement() {
    clearInterface();
    displayFoldersOf(getActiveProject());
    document.onmouseup = null;
    document.onmousemove = null;
    draggedClonedElement.remove();
    folderClonedElement.remove();
    document.body.style.cursor = "default";
    element.parentElement.style.visibility = "visible";
    element.parentElement.style.position = "inherit";
    for (const folder of activeFolders) {
      folder.removeEventListener("mouseenter", folderMouseEnter);
      folder.removeEventListener("mouseleave", folderMouseLeave);
      for (const todo of folder.querySelectorAll(".todo-box:not(#folder-cloned-element)")) {
        todo.removeEventListener("mouseover", taskMouseEnter);
      }
    }
  }

}