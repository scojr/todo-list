import { listProjects } from "./projects-logic";

const elements = (function () {
  const projectList = document.querySelector(".project-list");
  const container = document.querySelector(".container");
  return { projectList, container };
})();

export function refreshList() {
  for (const project of listProjects()) {
    const listItem = document.createElement("li");
    listItem.textContent = project.title;
    elements.projectList.appendChild(listItem);
  }
}