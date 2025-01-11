import "./style.css";

const projects = [];

export function getProjects() {
  return projects;
}

export function insertProject(input) {
  projects.push(input);
}

class Project {
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }

  tasks = [];

  get tasks() {
    return tasks;
  }

  addTask(task) {
    this.tasks.push(task);
  }
}

function newProject(name, description) {
  insertProject(new Project(name, description));
}

newProject("Chores", "Daily chores to complete.");

getProjects()[0].addTask("clean room");

console.log(getProjects());