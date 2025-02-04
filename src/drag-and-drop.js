import { dom } from "./dom-interface";
import { resetDisplay } from "./display";
import { controller } from "./logic";

export function enableDragAndDrop(element) {
  element.addEventListener("mousedown", (event) => elementDragging(event, element));
}

function elementDragging(event, element) {
  event.preventDefault();
  event.stopPropagation();
  document.onmousemove = dragElement;
  document.onmouseup = endDragElement;

  const elementCard = element.parentElement;

  const grabbedItem = new Element(element.parentElement);
  const hoveredItem = new Element(element.parentElement);
  const hoveredTable = new Element(grabbedItem.parentElement.parentElement);

  let newIndex = parseInt(grabbedItem.objectIndex);
  console.log({ newIndex });

  const placeholder = elementCard.cloneNode(true);
  placeholder.id = "placeholder";
  hoveredItem.parentElement.appendChild(placeholder);

  const draggedElement = elementCard.cloneNode(true);
  draggedElement.id = "dragging";
  draggedElement.setAttribute("data-index", "null");
  draggedElement.style.setProperty("pointer-events", "none");
  draggedElement.style.setProperty("width", elementCard.clientWidth + "px");
  dom.container.appendChild(draggedElement);
  draggedElement.style.setProperty("--mouse-x", (event.clientX - draggedElement.clientWidth / 2) + "px")
  draggedElement.style.setProperty("--mouse-y", (event.clientY - 12) + "px")

  elementCard.style.setProperty("display", "none");

  function taskHover(e) {
    e.stopPropagation();

    hoveredItem.setElement = e.srcElement;
    hoveredItem.parentElement.append(placeholder);

    newIndex = parseInt(hoveredItem.objectIndex);


    const targetBox = e.srcElement.getBoundingClientRect();

    const y = e.y - targetBox.top;

    if (y > targetBox.height / 2) {
      // Mouse enters from bottom //
      placeholder.style.setProperty("order", hoveredItem.objectIndex - 1);
    } else {
      // From top //
      placeholder.style.setProperty("order", hoveredItem.objectIndex);
    }
    hoveredItem.parentElement.append(placeholder);
    console.log({ newIndex });
  }

  function tableHover(e) {
    e.stopPropagation();

    hoveredItem.setElement = e.srcElement;
    hoveredItem.parentElement.append(placeholder);
    const hoveredItemIndex = hoveredItem.objectIndex;
    const tableCount = parseInt(controller.getActiveProject().children.length);

    newIndex = (Math.floor(e.x / (window.innerWidth / tableCount)));

    const targetBox = e.srcElement.getBoundingClientRect();

    const x = e.x - targetBox.left;
    if (x > targetBox.width / 2) {
      // From Left //
      placeholder.style.setProperty("order", hoveredItem.objectIndex - 1)
    } else {
      // From right //
      placeholder.style.setProperty("order", hoveredItem.objectIndex)
    }
    placeholder.style.setProperty("display", "block");
    console.log({ newIndex });
  }

  function mouseLeave(e) {
    e.stopPropagation();
    hoveredItem.setElement = null;
    hoveredTable.setElement = null;
    placeholder.style.setProperty("display", "none");
  }

  function taskTableHover(e) {
    e.stopPropagation();
    const targetBox = e.srcElement.getBoundingClientRect();
    const y = e.y - targetBox.top;
    const position = Math.floor((parseInt(e.layerY) + 65) / 58) - 5;
    hoveredTable.setElement = e.srcElement;
    e.srcElement.querySelector(".task-container").append(placeholder);
    placeholder.style.setProperty("order", position);
    placeholder.style.setProperty("display", "block");
  }

  function dragElement(dragEvent) {
    let activeTables = document.querySelectorAll(".table")
    let activeTasks = document.querySelectorAll(".task")
    if (grabbedItem.type === "task") {
      for (const task of activeTasks) {
        task.addEventListener("mouseenter", taskHover);
      }
      for (const table of activeTables) {
        table.addEventListener("mouseenter", taskTableHover);
        table.addEventListener("mouseleave", mouseLeave);
      }
    }
    if (grabbedItem.type === "table") {
      for (const table of activeTables) {
        table.addEventListener("mouseenter", tableHover);
      }
    }
    draggedElement.style.setProperty("--mouse-x", (dragEvent.clientX - draggedElement.clientWidth / 2) + "px")
    draggedElement.style.setProperty("--mouse-y", (dragEvent.clientY - 12) + "px")
  }

  function endDragElement() {
    if (hoveredItem.domElement || hoveredTable.domElement) {
      controller.moveChild(grabbedItem.object, hoveredTable.object, newIndex);
    }
    document.onmousedown = null;
    document.onmousemove = null;
    document.onmouseup = null;
    resetDisplay();
  }
}

class Element {
  constructor(domElement) {
    this.domElement = domElement;
  }
  set setElement(element) {
    this.domElement = element;
  }
  get object() {
    return getObjectOf(this.domElement);
  }
  get parentElement() {
    return this.domElement.parentElement;
  }
  get parentObject() {
    return getObjectOf(this.domElement).parentObject;
  }
  get type() {
    return this.domElement.dataset.type;
  }
  get objectIndex() {
    return this.domElement.dataset.index;
  }
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