import { controller } from "./logic";
import { dom } from "./dom-interface";
import { getCurrentDate } from "./date.js";
import { enableDragAndDrop } from "./drag-and-drop.js";
// import chevron from "./icons/chevron-down.svg";
// import dragHorizontal from "./icons/drag-horizontal.svg";

function makeCard(object) {
  const container = dom.make("div");
  container.classList.add(object.constructor.name.toLowerCase());
  const header = dom.make("div");
  header.classList.add(`${object.constructor.name.toLowerCase()}-header`);
  const title = dom.make("h2", object.title);
  header.appendChild(title);
  container.appendChild(header);
  return container;
}

function clearInterface() {
  while (dom.container.lastElementChild) {
    dom.container.removeChild(dom.container.lastElementChild);
  }
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
displayTablesOf(controller.getProjectByIndex(0))

function displayTablesOf(project) {
  for (const table of project.children) {
    const tableContainer = makeCard(table);
    const taskContainer = dom.make("div");
    taskContainer.classList.add("task-container")
    for (const task of table.children) {
      taskContainer.appendChild(makeCard(task))
      enableDragAndDrop(taskContainer);

    }
    tableContainer.appendChild(taskContainer);
    dom.container.appendChild(tableContainer);
  };
}

// // Todos //

// function displayTodosOf(folderTodos, domElement) {
//   const activeFolder = folderTodos.todos;
//   for (const todo of activeFolder) {
//     const card = dom.make("div");
//     card.classList.add("todo-container");
//     card.style.order = activeFolder.indexOf(todo);
//     const todoBox = dom.make("div", todo.name);
//     const todoDragIcon = dom.make("img");
//     todoDragIcon.src = dragHorizontal;
//     todoBox.classList.add("todo-box");
//     todoBox.setAttribute("data-index", activeFolder.indexOf(todo));
//     todoBox.addEventListener("mousedown", (event) => todoDragging(event, todoBox));
//     card.append(todoBox, todoDragIcon);
//     domElement.appendChild(card);
//   }
//   const todoFooter = dom.make("div");
//   const taskInput = makeInput("text", "newtask", "Add new task");
//   const footerSettings = dom.make("div");
//   footerSettings.classList.add("settings");
//   const colorSetting = dom.make("input");
//   colorSetting.type = "color";
//   const dateSetting = dom.make("input")
//   dateSetting.type = "date";
//   footerSettings.append(colorSetting, dateSetting)
//   const cardFooterAddButton = dom.make("button", "+");
//   cardFooterAddButton.classList.add("todo-add-button");
//   cardFooterAddButton.addEventListener("click", (e) => {
//     if (taskInput.input.value) {
//       folderTodos.newTodo(taskInput.input.value);
//       refreshContainer();
//     }
//   });
//   todoFooter.classList.add("todo-footer");
//   todoFooter.style.setProperty("order", "9999");
//   todoFooter.append(taskInput.label, footerSettings, cardFooterAddButton);
//   domElement.appendChild(todoFooter);
// }

// // Todo Dragging //
// // I promise I'll refactor this into its own module but wow it works!! //
// function todoDragging(event, element) {
//   event.preventDefault();
//   let activeFolders = document.querySelectorAll(".folder")
//   let hoveredFolder = event.currentTarget.parentElement.parentElement;
//   let hoveredTodo = event.currentTarget;
//   let grabbedTodo = event.currentTarget;

//   const draggedClonedElement = element.cloneNode(true);
//   draggedClonedElement.style.setProperty("width", `${element.clientWidth}px`);
//   draggedClonedElement.id = "dragging";
//   draggedClonedElement.setAttribute("data-index", "null");

//   const folderClonedElement = element.parentElement.cloneNode(true);
//   folderClonedElement.id = "folder-cloned-element";
//   folderClonedElement.firstElementChild.id = "inset"
//   hoveredFolder.appendChild(folderClonedElement);

//   element.parentElement.style.setProperty("display", "none");
//   document.body.style.setProperty("cursor", "grabbing", "important");
//   dom.container.appendChild(draggedClonedElement);
//   draggedClonedElement.style.setProperty("--mouse-x", (event.clientX - draggedClonedElement.clientWidth / 2) + "px")
//   draggedClonedElement.style.setProperty("--mouse-y", (event.clientY + 24) + "px")
//   document.onmousemove = dragElement;
//   document.onmouseup = closeDragElement;


//   function dragElement(e) {
//     draggedClonedElement.style.setProperty("--mouse-x", (e.clientX - draggedClonedElement.clientWidth / 2) + "px")
//     draggedClonedElement.style.setProperty("--mouse-y", (e.clientY + 24) + "px")
//     for (const folder of activeFolders) {
//       folder.addEventListener("mouseover", folderMouseEnter);
//       folder.addEventListener("mouseleave", folderMouseLeave);
//       for (const todo of folder.querySelectorAll(".todo-box:not(#folder-cloned-element)")) {
//         todo.addEventListener("mouseover", todoMouseEnter)
//       }
//     }
//   }

//   function todoMouseEnter(e) {
//     hoveredTodo = e.currentTarget;
//     const hoveredTodoIndex = hoveredTodo.dataset.index;
//     const todoBox = e.target.getBoundingClientRect();
//     const y = e.y - todoBox.top;
//     if (hoveredTodoIndex) {
//       if (y > todoBox.height / 2) {
//         // Mouse enters from bottom //
//         folderClonedElement.style.setProperty("order", hoveredTodoIndex - 1);
//       } else {
//         // Mouse enters from top //
//         folderClonedElement.style.setProperty("order", hoveredTodoIndex);
//       }
//     }
//   }

//   function folderMouseEnter(e) {
//     hoveredFolder = e.currentTarget;
//     hoveredFolder.appendChild(folderClonedElement);
//   }

//   function folderMouseLeave(e) {
//     hoveredFolder = null;
//     document.querySelector("#folder-cloned-element").remove();
//   }

//   function closeDragElement() {
//     if (hoveredFolder) {
//       const indexOfHoveredFolder = hoveredFolder.dataset.index;
//       const placeholderIndex = parseInt(folderClonedElement.style.order) + 1;
//       console.log(placeholderIndex);

//       const indexOfFromFolder = grabbedTodo.parentElement.parentElement.dataset.index;
//       const fromFolder = getActiveProject().folders[indexOfFromFolder]
//       const indexOfGrabbedTodo = grabbedTodo.dataset.index;

//       console.log({ fromFolder, grabbedTodo, hoveredFolder })

//       fromFolder.transferTodo(indexOfGrabbedTodo, indexOfHoveredFolder, placeholderIndex);
//     }
//     document.onmousemove = null;
//     document.onmouseup = null;
//     document.body.style.cursor = "default";
//     refreshContainer();
//   }
//   return;
// }