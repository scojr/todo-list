import { dom } from "./dom-interface";
import { controller } from "./logic";
import { resetDisplay } from "./display";

const container = dom.modalContainer;


const modalBackground = document.querySelector(".modal-background");
const newTaskModal = document.querySelector(".new-task-modal");
const editTableModal = document.querySelector(".edit-table-modal");

const colorInput = document.querySelector("input[type=color]")

export function addFormEventListeners() {

  const editButtons = document.querySelectorAll(".edit-button");
  const colorInput = document.querySelectorAll(".color-input");

  for (const button of editButtons) {
    button.addEventListener("click", editTable);
  }

  for (const button of colorInput) {
    button.addEventListener("input", colorTable);
  }

}


function colorTable(e) {
  const tableElement = e.srcElement.parentElement.parentElement.parentElement.parentElement;
  const tableObject = controller.getActiveProject().children[tableElement.dataset.index];
  tableElement.querySelector(".table-header").style.setProperty("background-color", e.target.value);
  tableObject.color = e.target.value;
}

function editTable(e) {
  e.stopPropagation();
  const tableElement = e.srcElement.parentElement.parentElement.parentElement.parentElement;
  const tableObject = controller.getActiveProject().children[tableElement.dataset.index];
  console.log({ tableElement, tableObject });
  console.log(e);

  const titleInput = dom.make("input");
  titleInput.classList.add("table-text-input");
  titleInput.type = "text";
  titleInput.value = tableObject.title;

  const tableTitleElement = tableElement.querySelector("h2");

  tableTitleElement.style.visibility = "hidden";
  tableElement.querySelector(".table-header").appendChild(titleInput);
  titleInput.focus();

  titleInput.addEventListener("blur", onClickAway)

  titleInput.addEventListener("keydown", (e) => {
    titleInput.removeEventListener("blur", onClickAway);
    if (e.key === "Enter") {
      newTableTitle(titleInput.value);
    } else if (e.key === "Escape") {
      newTableTitle(tableObject.title);
    }
  })

  function onClickAway() {
    if (titleInput.value !== tableObject.title) {
      newTableTitle(titleInput.value);
    } else {
      newTableTitle(tableObject.title);
    }
  }

  function newTableTitle(string) {
    tableObject.title = string;
    tableTitleElement.style.visibility = "visible";
    resetDisplay();
  }
}


dom.tablePlusButton.addEventListener("click", (e) => {
  addBlankTable();
})

modalBackground.addEventListener("mousedown", (event) => {
  if (!newTaskModal.matches(":hover") && !editTableModal.matches(":hover")) {
    closeModal();
    console.log(event);
  }
})

// textInput.addEventListener("input", (e) => {
//   header.textContent = e.srcElement.value;
// })


// confirmButton.addEventListener("click", (e) => {
//   e.preventDefault();
//   addTable(textInput.value, colorInput.value);
//   resetDisplay();
// })

// cancelButton.addEventListener("click", (e) => {
//   e.preventDefault();
//   dom.modalBackground.style.setProperty("visibility", "hidden");
// })

function addTable(title, color) {
  const index = controller.getActiveProject().children.length;
  controller.getActiveProject().newTable(title);
  controller.getActiveProject().children[index].newColor(color);
}

function addBlankTable() {
  const index = controller.getActiveProject().children.length;
  const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
  controller.getActiveProject().newTable("New Table");
  controller.getActiveProject().children[index].newColor(randomColor);
  resetDisplay();
}

function editTableButton(event) {

  const tableElement = event.srcElement.parentElement.parentElement.parentElement.parentElement;
  const tableObject = controller.getActiveProject().children[tableElement.dataset.index];
  const tableBox = event.srcElement.parentElement.parentElement.parentElement.parentElement.getBoundingClientRect();
  editTableModal.style.setProperty("visibility", "visible");
  modalBackground.style.setProperty("visibility", "visible");
  editTableModal.style.setProperty("--task-module-left", tableBox.right - 2 + "px");
  editTableModal.style.setProperty("--task-module-top", tableBox.y + 45 + "px");
  console.log(tableElement);
  console.log(tableObject);

  colorInput.addEventListener("input", editTableColor);

  function editTableColor(e) {
    tableElement.querySelector(".table-header").style.setProperty("background-color", e.target.value);
    tableObject.color = e.target.value;
    console.log({ tableObject });
  }

}




function addTaskButton(event) {
  const tableElement = event.srcElement.parentElement.parentElement.parentElement.parentElement;
  const tableObject = controller.getActiveProject().children[tableElement.dataset.index];
  console.log(tableObject);
  tableElement.appendChild(newTaskModal);
  newTaskModal.style.setProperty("visibility", "visible");
  modalBackground.style.setProperty("visibility", "visible");
  console.log(tableElement);
  console.log(newTaskModal);
}

function closeModal(e) {
  editTableModal.style.setProperty("visibility", "hidden");
  newTaskModal.style.setProperty("visibility", "hidden");
  modalBackground.style.setProperty("visibility", "hidden");
  resetDisplay();
}