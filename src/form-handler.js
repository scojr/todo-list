import { elements } from "./dom-interface";
import { newTask, newFolder } from "./tasks-handler";
import { refreshUI } from "./display-handler";

const main = elements.addTaskModal.main;
const form = elements.addTaskModal.form;
const buttons = elements.addTaskModal.buttons;

export function showModal() {
  main.style.setProperty("--visibility", "visbile");
}

export function hideModal() {
  main.style.setProperty("--visibility", "hidden");
  elements.addTaskModal.titleInput.value = "";
  elements.addTaskModal.descriptionInput.value = "";
}

main.addEventListener("mousedown", () => {
  if (!form.matches(':hover')) {
    hideModal()
  }
})

buttons.close.addEventListener("click", (e) => {
  e.preventDefault();
  hideModal();
})

buttons.addTask.addEventListener("click", (e) => {
  e.preventDefault();
  const titleValue = elements.addTaskModal.titleInput.value;
  newTask(titleValue);
  refreshUI();
})