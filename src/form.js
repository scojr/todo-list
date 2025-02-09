import { dom } from "./dom-interface";
import { controller } from "./logic";
import { resetDisplay } from "./display";

const container = dom.modalContainer;

const editButtons = document.querySelectorAll(".edit-button");
const addButtons = document.querySelectorAll(".add-button");

const modalBackground = document.querySelector(".modal-background");
const newTaskModal = document.querySelector(".new-task-modal");
const editTableModal = document.querySelector(".edit-table-modal");

const colorInput = document.querySelector("input[type=color]")

for (const button of editButtons) {
  button.addEventListener("click", editTableButton);
}

for (const button of addButtons) {
  button.addEventListener("click", addTaskButton);
}

dom.tablePlusButton.addEventListener("click", (e) => {
  addBlankTable();
})

modalBackground.addEventListener("mousedown", (event) => {
  if (!newTaskModal.matches(":hover") && !editTableModal.matches(":hover")) {
    closeModal();
    console.log(event);
    console.log("hover?")
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

  colorInput.addEventListener("input", (e) => {
    tableElement.querySelector(".table-header").style.setProperty("background-color", e.target.value)
    tableObject.setColor = e.target.value;
  })
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
}