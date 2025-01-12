import { constructProject } from "./project-constructor";

export function newProject(title, description) {
  constructProject(title, description);
}

export function newTask(project, task) {
  project.addTask(task);
}