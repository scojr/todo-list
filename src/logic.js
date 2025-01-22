const projects = [];

export function createProject(name, deadline, priority) {
  const newProject = new Project(name, deadline, priority);
  projects.push(newProject);
}

export function getProjects() {
  return projects;
}

export function getProjectFromName(string) {
  const unparsedString = string;
  const unparsedSearch = projects.find(project => project.name === unparsedString);
  if (unparsedSearch) return unparsedSearch;
  const parsedString = string.replaceAll(" ", "").toLowerCase();
  const parsedSearch = projects.find(project => project.name.replaceAll(" ", "").toLowerCase() === parsedString)
  if (parsedSearch) return parsedSearch;
  else return console.log("No project found");
}

function parseDate(stringDate) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(stringDate);
}

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

// For Testing

createProject("Clean room", "", true);
createProject("Make sandwich", "", "");
createProject("Todo list web app", "", true);
console.log(projects[0]);
projects[0].newFolder("List");
projects[0].folders[0].newTodo("todo");
projects[0].folders[0].todos[0].priority = true;

export function tester() {
  console.log(projects);
  console.log(getProjectFromName("clean room"))
}


