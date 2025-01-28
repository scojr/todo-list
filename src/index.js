// // import "./style.css";
// // import { getActiveProject } from "./logic";
// // import { listProjects, displayDate, displayFoldersOf } from "./display";

// listProjects();
// displayDate();
// displayFoldersOf(getActiveProject());


// Behaviors
const canMakeTable = {
  newTable() {
    const child = new Table(title, this);
    this.children.push(child);
  }
}

const canMakeTask = {
  newTask() {
    const child = new Task(title, this);
    this.children.push(child);
  }
}

const hasDescription = {
  newDescription(string) {
    this.description = string;
  }
}

// Classes
class Project {
  constructor(title) {
    this.title = title;
  }
  children = [];
  deadline;
  label;
}

Object.assign(Project, canMakeTable, hasDescription);

class Table extends Project {
  constructor(title, parent) {
    this.parentObject = parent;
  }
}

Object.assign(Table, canMakeTask);

class Task extends Table {
}