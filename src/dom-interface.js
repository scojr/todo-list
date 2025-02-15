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
  confirmDeleteContainer: get(".modal-container.delete-confirmation"),
  confirmDeleteBackground: get(".modal-background.delete-confirmation"),
  confirmDeleteProjectContainer: get(".modal-container.delete-project-confirmation"),
  confirmDeleteProjectBackground: get(".modal-background.delete-project-confirmation"),
  newProjectContainer: get(".modal-container.new-project"),
  newProjectBackground: get(".modal-background.new-project"),
  confirmElementContainer: get(".modal-element-holder"),
  tablePlusButton: get(".table-plus"),
  projectEditButton: get(".project-edit"),
  trash: get(".trash"),
  get,
  make,
}