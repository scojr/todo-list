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
  projectList: get(".project-list"),
  headerDate: get(".header.date"),
  headerDay: get(".header.day"),

  get,
  make,
}