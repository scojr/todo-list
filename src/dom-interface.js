const get = function (element) {
  return document.querySelector(element);
}

const make = function (tag, textContent) {
  const element = document.createElement(tag);
  if (textContent) element.textContent = textContent;
  return element;
}

export const dom = {
  container: get(".container"),
  header: get(".header"),
  headerContainer: get(".header-container"),
  projectList: get(".project-list"),
  headerDate: get(".header.date"),
  headerDay: get(".header.day"),
  projectTitle: get(".project-title"),
  projectDescription: get(".project-description"),
  confirmDeleteContainer: get(".modal-container"),
  confirmDeleteBackground: get(".modal-background"),
  confirmElementContainer: get(".modal-element-holder"),
  tablePlusButton: get(".table-plus"),
  trash: get(".trash"),
  get,
  make,
}