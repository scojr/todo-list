const tasks = [];
const folders = [];

class Task {
  constructor(objective, details, deadline) {
    this.title = objective;
    this.details = details;
    this.deadline = deadline;
  }
}

class Folder {
  constructor(name, details) {
    this.title = name;
    this.details = details;
  }
  tasks = [];
  get tasks() {
    return tasks;
  }
  set insert(task) {
    this.tasks.push(task);
  }
}

export function newTask(objective, details, deadline) {
  const task = new Task(objective, details, deadline);
  tasks.push(task);
}

export function newFolder(name, details) {
  const folder = new Folder(name, details);
  folders.push(folder);
}

export function getTasks() {
  return tasks;
}

export function getFolders() {
  return folders;
}

newTask("clean room", "clean up my roomn", "tonight");

console.log(getTasks());