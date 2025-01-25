const projects = [];
let activeProject;

export function createProject(name, deadline, priority) {
  const newProject = new Project(name, deadline, priority);
  projects.push(newProject);
}

export function getActiveProject() {
  return activeProject;
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

  spliceTodo(todo, index) {
    this.#todos.splice(index, 0, todo[0]);
  }

  transferTodo(todoIndex, toFolderIndex, newTodoIndex) {
    const toFolder = getActiveProject().folders[toFolderIndex];
    const todoCopy = this.#todos.slice(todoIndex, parseInt(todoIndex) + 1);
    this.#todos.splice(todoIndex, 1);
    toFolder.spliceTodo(todoCopy, newTodoIndex);
  }

  newTodo(name) {
    const todo = new Todo(name);
    this.insert(todo);
  }
}

class Todo extends Card {
  #unique = Math.random();
  makeUnique() {
    this.#unique = Math.random();
  }
}

// For Testing

const folderTemplate = ["To Do", "Doing", "Done"];
const todosTemplate1 = ["declutter desk", "organize bookshelf", "dust surfaces", "vacuum", "wipe suprfaces",];
const todosTemplate2 = ["sanitize", "organize closet", "make bed", "take out trash",];
const todosTemplate3 = ["clean mirror", "fold clothes",];
const todosTemplates = [todosTemplate1, todosTemplate2, todosTemplate3];

createProject("Make sandwich", "", "");
createProject("Clean room", "", true);
createProject("Todo list web app", "", true);

activeProject = projects[1];

for (const folder of folderTemplate) {
  projects[1].newFolder(folder);
}

for (const folder of projects[1].folders) {
  console.log(folder)
  for (const todo of todosTemplates[activeProject.folders.indexOf(folder)]) {
    folder.newTodo(todo);
  }
}




