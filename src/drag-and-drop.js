import { dom } from "./dom-interface";
import { resetDisplay } from "./display";
import { controller } from "./logic";
import dragHorizontal from "./icons/drag-horizontal.svg";

export function enableDragAndDrop(element) {
  const indicator = dom.make("img");
  indicator.src = dragHorizontal;
  indicator.width = "36"
  indicator.classList.add("drag-icon");
  element.append(indicator);
  indicator.addEventListener("mousedown", (event) => elementDragging(event, element));
}

function elementDragging(event, element) {
  event.preventDefault();
  event.stopPropagation();
  document.body.style.setProperty("cursor", "grabbing");
  document.onmousemove = dragElement;
  document.onmouseup = endDragElement;

  const elementCard = element.parentElement;

  const grabbedItem = new Element(element.parentElement);
  const hoveredItem = new Element(element.parentElement);
  const hoveredTable = new Element(grabbedItem.parentElement.parentElement);

  let newIndex = parseInt(grabbedItem.objectIndex);

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
    const taskContainerBox = hoveredTable.domElement.querySelector(".task-container").getBoundingClientRect();
    const taskContainerBoxHeight = taskContainerBox.height - 8;

    function getTableLength() {
      let length = hoveredItem.parentElement.childElementCount - 1;
      if (hoveredItem.parentObject.children.includes(grabbedItem.object)) {
        return length;
      } else {
        return length + 1;
      }
    }

    const tableLength = getTableLength();

    newIndex = (Math.floor((e.y - taskContainerBox.top) / ((taskContainerBoxHeight / tableLength))));

    const targetBox = e.srcElement.getBoundingClientRect();
    const y = e.y - targetBox.top;

    if (y > targetBox.height / 2) {
      // Mouse enters from bottom //
      placeholder.style.setProperty("order", hoveredItem.objectIndex - 1);
    } else {
      // From top //
      placeholder.style.setProperty("order", hoveredItem.objectIndex);
    }
  }

  function tableHover(e) {
    e.stopPropagation();

    hoveredItem.setElement = e.srcElement;
    hoveredItem.parentElement.append(placeholder);
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
    const position = Math.floor((parseInt(e.layerY) + 65) / 58) - 3;
    hoveredTable.setElement = e.srcElement;
    e.srcElement.querySelector(".task-container").append(placeholder);
    placeholder.style.setProperty("order", position);
    placeholder.style.setProperty("display", "block");
  }

  function dragElement(dragEvent) {
    dom.trash.classList.add("active");
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
    dom.trash.classList.remove("active");
    if (dom.trash.matches(":hover")) {
      trash();
    } else if (hoveredItem.domElement || hoveredTable.domElement) {
      controller.moveChild(grabbedItem.object, hoveredTable.object, newIndex);
      reset();
    }
  }

  function trash() {
    console.log("trash");
    if (deleteConfirmationCheck(grabbedItem.type)) {
      document.onmousedown = null;
      document.onmousemove = null;
      document.onmouseup = null;
      document.body.style.removeProperty("cursor");
      if (dom.confirmElementContainer.lastElementChild) dom.confirmElementContainer.lastElementChild.remove();
      dom.confirmDeleteBackground.style.visibility = "visible";

      dom.confirmElementContainer.append(draggedElement);
      draggedElement.id = "deleting";

      const confirmButton = dom.confirmDeleteContainer.querySelector(".delete-confirmation-button");
      const cancelButton = dom.confirmDeleteContainer.querySelector(".delete-cancel-button");

      cancelButton.addEventListener("click", deleteCancelClick);
      confirmButton.addEventListener("click", deleteConfirmClick);
      dom.confirmDeleteBackground.addEventListener("click", (e) => {
        if (!dom.confirmDeleteContainer.matches(":hover")) {
          deleteCancelClick(e)
        }
      })

      function deleteConfirmClick(e) {
        e.preventDefault();
        dom.confirmDeleteBackground.style.visibility = "hidden";
        grabbedItem.parentObject.deleteChild(grabbedItem.objectIndex);
        reset();
        confirmButton.removeEventListener("click", deleteConfirmClick);
        cancelButton.removeEventListener("click", deleteCancelClick);
      }

      function deleteCancelClick(e) {
        e.preventDefault();
        dom.confirmDeleteBackground.style.visibility = "hidden";
        cancelButton.removeEventListener("click", this);
        reset();
        confirmButton.removeEventListener("click", deleteConfirmClick);
        cancelButton.removeEventListener("click", deleteCancelClick);
      }
    } else {
      grabbedItem.parentObject.deleteChild(grabbedItem.objectIndex);
      reset();
    }
  }
}

function reset() {
  document.onmousedown = null;
  document.onmousemove = null;
  document.onmouseup = null;
  resetDisplay();
  document.body.style.removeProperty("cursor");
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

function deleteConfirmationCheck(elementType) {
  const inputs = dom.confirmDeleteContainer.querySelectorAll("input");
  for (const input of inputs) {
    if (input.dataset.inputType === elementType && input.checked) return true;
  }
}