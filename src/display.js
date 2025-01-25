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
    const stylingSpan = dom.make("span");
    li.appendChild(stylingSpan);
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
    // console.log(activeFolder.indexOf(todo))
    const todoBox = dom.make("div", todo.name);
    todoBox.classList.add("todo-box");
    todoBox.setAttribute("data-index", activeFolder.indexOf(todo));
    todoBox.addEventListener("mousedown", (event) => todoDragging(event, todoBox));
    card.append(todoBox);
    domElement.appendChild(card);
  }
  const cardFooter = dom.make("div");
  const cardInternal = dom.make("button", "+");
  const cardFooterText = dom.make("h2");
  cardFooter.classList.add("todo-add-button");
  cardFooter.style.setProperty("order", "9999");
  cardFooter.append(cardInternal, cardFooterText);
  domElement.appendChild(cardFooter);
}

// Todo Dragging //
// I promise I'll refactor this into its own module but wow it works!! //

function todoDragging(event, element) {
  event.preventDefault();
  let activeFolders = document.querySelectorAll(".folder")
  let hoveredFolder = event.currentTarget.parentElement.parentElement;
  let hoveredTodo = event.currentTarget;
  let grabbedTodo = event.currentTarget;

  const draggedClonedElement = element.cloneNode(true);
  draggedClonedElement.style.setProperty("width", `${element.clientWidth}px`);
  draggedClonedElement.id = "dragging";
  draggedClonedElement.setAttribute("data-index", "null");

  const folderClonedElement = element.parentElement.cloneNode(true);
  folderClonedElement.id = "folder-cloned-element";
  folderClonedElement.lastElementChild.id = "inset"
  hoveredFolder.appendChild(folderClonedElement);

  element.parentElement.style.setProperty("display", "none");
  document.body.style.setProperty("cursor", "grabbing", "important");
  dom.container.appendChild(draggedClonedElement);
  draggedClonedElement.style.setProperty("--mouse-x", (event.clientX - draggedClonedElement.clientWidth / 2) + "px")
  draggedClonedElement.style.setProperty("--mouse-y", (event.clientY + 24) + "px")
  document.onmousemove = dragElement;
  document.onmouseup = closeDragElement;


  function dragElement(e) {
    draggedClonedElement.style.setProperty("--mouse-x", (e.clientX - draggedClonedElement.clientWidth / 2) + "px")
    draggedClonedElement.style.setProperty("--mouse-y", (e.clientY + 24) + "px")
    for (const folder of activeFolders) {
      folder.addEventListener("mouseover", folderMouseEnter);
      folder.addEventListener("mouseleave", folderMouseLeave);
      for (const todo of folder.querySelectorAll(".todo-box:not(#folder-cloned-element)")) {
        todo.addEventListener("mouseover", todoMouseEnter)
      }
    }
  }

  function todoMouseEnter(e) {
    hoveredTodo = e.currentTarget;
    const hoveredTodoIndex = hoveredTodo.dataset.index;
    const todoBox = e.target.getBoundingClientRect();
    const y = e.y - todoBox.top;
    if (hoveredTodoIndex) {
      if (y > todoBox.height / 2) {
        // Mouse enters from bottom //
        folderClonedElement.style.setProperty("order", hoveredTodoIndex - 1);
      } else {
        // Mouse enters from top //
        folderClonedElement.style.setProperty("order", hoveredTodoIndex);
      }
    }
  }

  function folderMouseEnter(e) {
    hoveredFolder = e.currentTarget;
    hoveredFolder.appendChild(folderClonedElement);
  }

  function folderMouseLeave(e) {
    hoveredFolder = null;
    document.querySelector("#folder-cloned-element").remove();
  }

  function closeDragElement() {
    if (hoveredFolder) {
      const indexOfHoveredFolder = hoveredFolder.dataset.index;
      const placeholderIndex = parseInt(folderClonedElement.style.order) + 1;
      console.log(placeholderIndex);

      const indexOfFromFolder = grabbedTodo.parentElement.parentElement.dataset.index;
      const fromFolder = getActiveProject().folders[indexOfFromFolder]
      const indexOfGrabbedTodo = grabbedTodo.dataset.index;

      console.log({ fromFolder, grabbedTodo, hoveredFolder })

      fromFolder.transferTodo(indexOfGrabbedTodo, indexOfHoveredFolder, placeholderIndex);
    }
    document.onmousemove = null;
    document.onmouseup = null;
    document.body.style.cursor = "default";
    clearInterface();
    displayFoldersOf(getActiveProject());
  }
  return;
}