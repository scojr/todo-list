import "./style.css";

const projects = [];

class Card {
  constructor(name) {
    this.name = name;
  }

  #deadline = undefined;
  #priority = false;

  set deadline(date) {
    if (parseDate(date)) {
      this.#deadline = date;
    } else {
      console.log("YYYY-MM-DD Format Required")
    }
  }

  set priority(boolean) {
    if (typeof (boolean) === "boolean") {
      this.#priority = boolean;
    } else {
      this.#priority = false;
    }
  }
}

class Project extends Card {
  #folders = [];

  get folders() {
    return this.#folders;
  }

  insert(folder) {
    this.#folders.push(folder);
  }

  newFolder(name) {
    const folder = new Folder(name);
    this.insert(folder);
  }
}

class Folder extends Card {
  #todos = [];

  get todos() {
    return this.#todos;
  }

  insert(todoItem) {
    this.#todos.push(todoItem);
  }

  newTodo(name) {
    const todo = new Todo(name);
    this.insert(todo);
  }
}

class Todo extends Card {
  toFolder(folderIndex) {
    folders[folderIndex].insert(this);
  }
}

function parseDate(stringDate) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(stringDate);
}

function createProject(name, deadline, priority) {
  const newProject = new Project(name, deadline, priority);
  projects.push(newProject);
}

// For Testing

createProject("Clean room", "", true);
console.log(projects[0]);
projects[0].newFolder("List");
projects[0].folders[0].newTodo("todo");
projects[0].folders[0].todos[0].priority = true;

function tester() {
  console.log(projects);
}

window.global = tester();


