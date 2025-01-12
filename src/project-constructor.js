import { listProjects, insertProject } from "./projects-logic";

class Project {
  constructor(title, description) {
    this.title = title;
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

export function constructProject(title, description) {
  insertProject(new Project(title, description));
  console.log(listProjects());
}