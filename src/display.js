import { getProjects } from "./logic";
import { getCurrentDate } from "./date.js";


const dom = (function () {
  const container = get(".container");
  const sidebar = get(".sidebar");
  const projectList = get(".project-list");
  const headerDate = get(".sidebar-date");
  const headerDay = get(".sidebar-day");
  function get(element) {
    return document.querySelector(element)
  }
  function make(tag, textContent) {
    const element = document.createElement(tag);
    if (textContent) element.textContent = textContent;
    return element;
  }
  return { make, container, sidebar, projectList, headerDate, headerDay };
})();

// Sidebar //

export function listProjects() {
  const projects = getProjects();
  for (const project of projects) {
    const card = dom.make("li", project.name)
    dom.projectList.appendChild(card);
  }
}

export function displayDate() {
  dom.headerDay.textContent = `${getCurrentDate.weekday()}`;
  dom.headerDate.textContent = `${getCurrentDate.month()} ${getCurrentDate.day()} ${getCurrentDate.year()}`;
}

