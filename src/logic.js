let projects = [];
let activeProject = "";

export const controller = {
  newProject: function (name) {
    const newProject = new Project(name);
    projects.push(newProject);
  },

  getProjects: function () {
    return projects;
  },

  setActiveProject: function (index) {
    activeProject = projects[index];
  },

  getActiveProject: function (index) {
    return activeProject;
  },

  getProjectByIndex: function (index) {
    return projects[index];
  },

  moveChild: function (child, toObject, newChildIndex) {
    console.log({ child, toObject, newChildIndex })
    const childIndex = child.parentObject.children.indexOf(child);
    console.log({ childIndex })
    const objectToMove = child.parentObject.children.splice(childIndex, 1)[0];
    objectToMove.setParent(toObject);
    toObject.children.splice(newChildIndex, 0, objectToMove);
  }
};

// Behaviors

const CanMakeTask = {
  newTask(title) {
    const child = new Task(title, this);
    this.children.push(child);
  }
}

const HasCustomColor = {
  newColor(hex) {
    this.color = hex;
  }
}

const CanMakeTable = {
  newTable(title) {
    const child = new Table(title, this);
    this.children.push(child);
  }
}

const HasDescription = {
  newDescription(string) {
    this.description = string;
  }
}

// Classes

class Project {
  constructor(title) {
    this.title = title;
  }
  #children = [];
  #deadline;
  #label;
  get children() {
    return this.#children;
  }
}

Object.assign(Project.prototype, CanMakeTable, HasDescription);

class Table extends Project {
  constructor(title, parent) {
    super(title);
    this.parentObject = parent;
    this.id = Math.random();
  }
  setParent(object) {
    this.parentObject = object;
  }

}

Object.assign(Table.prototype, CanMakeTask, HasCustomColor);

class Task extends Table {
  constructor(title, parent) {
    super(title, parent);
  }
}

// class Card {
//   constructor(name) {
//     this.name = name;
//   }

//   #deadline = undefined;
//   #priority = false;

//   set deadline(date) {
//     if (parseDate(date)) {
//       this.#deadline = date;
//     } else {
//       console.log("YYYY-MM-DD Format Required")
//     }
//   }

//   set priority(boolean) {
//     if (typeof (boolean) === "boolean") {
//       this.#priority = boolean;
//     } else {
//       this.#priority = false;
//     }
//   }
// }

// class Project extends Card {
//   #folders = [];

//   get folders() {
//     return this.#folders;
//   }

//   insert(folder) {
//     this.#folders.push(folder);
//   }

//   newFolder(name) {
//     const folder = new Folder(name);
//     this.insert(folder);
//   }
// }

// class Folder extends Card {
//   #todos = [];

//   get todos() {
//     return this.#todos;
//   }

//   insert(todoItem) {
//     this.#todos.push(todoItem);
//   }

//   spliceTodo(todo, index) {
//     this.#todos.splice(index, 0, todo[0]);
//   }

//   transferTodo(todoIndex, toFolderIndex, newTodoIndex) {
//     const toFolder = getActiveProject().folders[toFolderIndex];
//     const todoCopy = this.#todos.slice(todoIndex, parseInt(todoIndex) + 1);
//     this.#todos.splice(todoIndex, 1);
//     toFolder.spliceTodo(todoCopy, newTodoIndex);
//   }

//   newTodo(name) {
//     const todo = new Todo(name);
//     this.insert(todo);
//   }
// }

// class Todo extends Card {
//   #unique = Math.random();
//   makeUnique() {
//     this.#unique = Math.random();
//   }
// }

// For Testing

const tableTemplate = ["Ideas", "To Do", "Doing", "Done"];
const tableColors = ["ffe600", "00ff00", "00ccff", "ff6600"]

const taskTemplate1 = ["animation", "notepad", "dark mode", "custom themes",];
const taskTemplate2 = ["deadlines", "priority status", "labels", "project form", "folder form", "localStorage saving", "project data to json", "color",];
const taskTemplate3 = ["todo form",];
const taskTemplate4 = ["drag & drop todos", "basic styling",];
const taskTemplates = [taskTemplate1, taskTemplate2, taskTemplate3, taskTemplate4];

controller.newProject("Todo List App", "", true);
projects[0].description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
controller.newProject("Placeholder One", "", true);
controller.newProject("Placeholder Two", "", true);

activeProject = projects[0];

for (const table of tableTemplate) {
  controller.getProjectByIndex(0).newTable(table);
  for (const taskTemplate of taskTemplates[tableTemplate.indexOf(table)]) {
    controller.getProjectByIndex(0).children[tableTemplate.indexOf(table)].newTask(taskTemplate);
  }
}

for (const color of tableColors) {
  const index = tableColors.indexOf(color);
  controller.getActiveProject().children[index].newColor(color);
}