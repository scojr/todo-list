import { elements } from "./dom-interface";

export function showModal() {
  elements.addTaskModal.style.setProperty("--visibility", "visbile");
}

export function hideModal() {
  elements.addTaskModal.style.setProperty("--visibility", "hidden");
}
