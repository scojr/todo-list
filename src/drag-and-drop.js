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

  const grabbedItem = new Element(element);
  const hoveredItem = new Element(element);
  const hoveredTable = new Element(grabbedItem.parentElement.parentElement);

  let newIndex = parseInt(grabbedItem.objectIndex);
  console.log({ newIndex });

  const placeholder = element.cloneNode(true);
  placeholder.id = "placeholder";
  hoveredItem.parentElement.appendChild(placeholder);

  const draggedElement = element.cloneNode(true);
  draggedElement.id = "dragging";
  draggedElement.setAttribute("data-index", "null");
  draggedElement.style.setProperty("pointer-events", "none");
  draggedElement.style.setProperty("width", element.clientWidth + "px");
  dom.container.appendChild(draggedElement);
  draggedElement.style.setProperty("--mouse-x", (event.clientX - draggedElement.clientWidth / 2) + "px")
  draggedElement.style.setProperty("--mouse-y", (event.clientY - 12) + "px")

  element.style.setProperty("display", "none");

  function taskHover(e) {
    e.stopPropagation();
    hoveredItem.setElement = e.srcElement;
    console.log(hoveredItem);
    console.log(e);
    const targetBox = e.target.getBoundingClientRect();
    const y = e.y - targetBox.top;

    if (hoveredItem.objectIndex && hoveredItem.type === "task") {
      console.log("is task");
      if (y > targetBox.height / 2) {
        // Mouse enters from bottom //
        if (newIndex === parseInt(hoveredItem.objectIndex)) {
          newIndex = parseInt(hoveredItem.objectIndex) - 1;
        } else {
          newIndex = parseInt(hoveredItem.objectIndex);
        }
        placeholder.style.setProperty("order", hoveredItem.objectIndex - 1);
      } else {
        // Mouse enters from top //
        newIndex = parseInt(hoveredItem.objectIndex);
        placeholder.style.setProperty("order", hoveredItem.objectIndex);
      }
    }
  }

  function tableHover(e) {
    e.stopPropagation();
    hoveredItem.setElement = e.srcElement;
    console.log(hoveredItem);
    const targetBox = e.target.getBoundingClientRect();
    const x = e.x - targetBox.left;

    if (hoveredItem.objectIndex && hoveredItem.type === "table") {
      console.log("is table");
      if (x > targetBox.height / 2) {
        // Mouse enters from bottom //
        if (newIndex === parseInt(hoveredItem.objectIndex)) {
          newIndex = parseInt(hoveredItem.objectIndex) - 1;
        } else {
          newIndex = parseInt(hoveredItem.objectIndex);
        }
        placeholder.style.setProperty("order", hoveredItem.objectIndex - 1);
      } else {
        // Mouse enters from top //
        newIndex = parseInt(hoveredItem.objectIndex);
        placeholder.style.setProperty("order", hoveredItem.objectIndex);
      }
    }
  }

  function taskTableHover(e) {
    e.stopPropagation();
    const table = e.srcElement;
    hoveredTable.setElement = table;
    table.querySelector(".task-container").append(placeholder);
  }

  function dragElement(dragEvent) {
    let activeTables = document.querySelectorAll(".table:not(#placeholder)")
    let activeTasks = document.querySelectorAll(".task:not(#placeholder)")
    if (grabbedItem.type === "task") {
      for (const task of activeTasks) {
        task.addEventListener("mouseenter", taskHover);
      }
      for (const table of activeTables) {
        table.addEventListener("mouseenter", taskTableHover);
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
    console.log({ grabbedItem });
    console.log({ hoveredItem });
    console.log({ hoveredTable });
    if (hoveredItem.domElement) {
      controller.moveChild(grabbedItem.object, hoveredTable.object, newIndex);

      // hoveredItem.parentObject.spliceChild(
      //   placeholderIndex,
      //   grabbedObjectCopy
      // );

      // grabbedItem.parentObject.killChild(grabbedItem.objectIndex);


      // grabbedItem.parentObject.transferChild(
      //   grabbedItem.object,
      //   newParentIndex,
      //   placeholderIndex,
      // );
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