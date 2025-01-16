const tasks = [];
const folders = [];

class Task {
  constructor(title, details, deadline) {
    this.title = title;
    this.details = details;
    this.deadline = deadline;
  }
}

class Folder {
  constructor(name, details) {
    this.name = name;
    this.details = details;
    this.id = name.toLowerCase().replaceAll(/[^A-Za-z0-9]/g, "");
  }
  tasks = [];
  get tasks() {
    return tasks;
  }
  insert(task) {
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

export function taskToFolder(taskIndex, folderIndex) {
  folders[folderIndex].insert(tasks[taskIndex]);
  tasks.splice(taskIndex, 1)
}

export function getTasks() {
  return tasks;
}

export function getFolders() {
  return folders;
}

// Placeholder for testing
newTask("clean room", "clean up my roomn", "tonight");
newFolder("Chores")
