import { getProjects } from "./logic";


const dom = (function () {
  const container = get(".container");
  const sidebar = get(".sidebar");
  const projectList = get(".project-list");
  function get(element) {
    return document.querySelector(element)
  }
  function make(tag, textContent) {
    const element = document.createElement(tag);
    if (textContent) element.textContent = textContent;
    return element;
  }
  return { make, container, sidebar, projectList };
})();

export function displayProjects() {
  const projects = getProjects();
  for (const project of projects) {
    const card = dom.make("li", project.name)
    dom.projectList.appendChild(card);
  }
}