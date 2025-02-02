import { dom } from "./dom-interface";
import { resetDisplay } from "./display";
import { controller } from "./logic";

export function enableDragAndDrop(element) {
  element.addEventListener("mousedown", (event) => elementDragging(event, element));
}

function elementDragging(event, element) {
  event.preventDefault();
  event.stopPropagation();

  const type = element.dataset.type;
  const grabbedElement = element;
  const grabbedObject = getObjectOf(element);

  let hoveredElement = element;
  let hoveredElementParent = element.parentElement;

  const placeholder = element.cloneNode(true);
  placeholder.id = "placeholder";

  element.parentElement.appendChild(placeholder);
  const clonedElement = createCloneToDrag(event, grabbedElement);
  dom.container.appendChild(clonedElement);

  clonedElement.style.setProperty("--mouse-x", (event.clientX - clonedElement.clientWidth / 2) + "px")
  clonedElement.style.setProperty("--mouse-y", (event.clientY - 12) + "px")

  element.style.setProperty("display", "none");

  document.onmousemove = dragElement;
  document.onmouseup = endDragElement;

  function mouseLeave(e) {
    hoveredElement = null;
    document.querySelector("#placeholder").remove();
  }

  function tableHover(e) {
    event.stopPropagation();
    hoveredElementParent = e.currentTarget;
    hoveredElementParent.querySelector(".task-container").appendChild(placeholder);
  }

  function mouseHover(e) {
    console.log({ e });
    event.stopPropagation();
    hoveredElement = e.srcElement;
    const hoveredElementIndex = hoveredElement.dataset.index;
    console.log(hoveredElementIndex);
    const targetBox = e.target.getBoundingClientRect();
    const y = e.y - targetBox.top;
    const x = e.x - targetBox.left;

    if (hoveredElementIndex && type === "task") {
      console.log("type is task");
      if (y > targetBox.height / 2) {
        // Mouse enters from bottom //
        placeholder.style.setProperty("order", hoveredElementIndex - 1);
      } else {
        // Mouse enters from top //
        placeholder.style.setProperty("order", hoveredElementIndex);
      }
    }

    if (hoveredElementIndex && type === "table") {
      console.log("type is table");
      if (x > targetBox.width / 2) {
        // Mouse enters from left //
        placeholder.style.setProperty("order", hoveredElementIndex - 1);
      } else {
        // Mouse enters from right //
        placeholder.style.setProperty("order", hoveredElementIndex);
      }
    }
  }

  function dragElement(dragEvent) {
    let activeTables = document.querySelectorAll(".table:not(#placeholder)")
    let activeTasks = document.querySelectorAll(".task:not(#placeholder)")
    if (type === "task") {
      for (const task of activeTasks) {
        task.addEventListener("mouseenter", mouseHover);
      }
      for (const table of activeTables) {
        table.addEventListener("mouseenter", tableHover);
        table.addEventListener("mouseleave", mouseLeave);
      }
    }
    if (type === "table") {
      for (const table of activeTables) {
        table.addEventListener("mouseenter", mouseHover);
      }
    }
    clonedElement.style.setProperty("--mouse-x", (dragEvent.clientX - clonedElement.clientWidth / 2) + "px")
    clonedElement.style.setProperty("--mouse-y", (dragEvent.clientY - 12) + "px")
  }

  function endDragElement() {
    document.onmousedown = null;
    document.onmousemove = null;
    document.onmouseup = null;
    if (hoveredElement) {

      console.log(hoveredElement);

      const placeholderIndex = parseInt(placeholder.style.order) + 1;

      getObjectOf(placeholder.parentElement.parentElement).relocateChild(
        grabbedObject,
        placeholderIndex,
      )

    }
    resetDisplay();
  }
}

function createCloneToDrag(event, element) {
  const clonedElement = element.cloneNode(true);
  clonedElement.id = "dragging";
  clonedElement.setAttribute("data-index", "null");
  clonedElement.style.setProperty("pointer-events", "none");
  clonedElement.style.setProperty("width", element.clientWidth + "px");
  return clonedElement;
}

function getObjectOf(element) {
  const objectType = element.dataset.type;
  const objectIndex = element.dataset.index;
  if (objectType === "table") {
    return controller.getActiveProject().children[objectIndex];
  }
  if (objectType === "task") {
    return controller.getActiveProject().children[element.parentElement.parentElement.dataset.index].children[objectIndex];
  }
  else {
    return controller.getActiveProject();
  }
}


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
