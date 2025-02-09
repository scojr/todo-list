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
  },

  saveToLocalStorage: function () {
    localStorage.setItem("myProjects",);
    localStorage.setItem("myProjects",);
    localStorage.setItem("myProjects",);
    for (const project of projects) {
      localStorage.setItem("myProjects", JSON.stringify(project));
      console.log(JSON.stringify(project));
      for (const table of project.children) {
        console.log(JSON.stringify(table));
        for (const task of table.children) {
          console.log(JSON.stringify(task));
        }
      }
    }
  },
};

// Behaviors

const CanMakeTask = {
  newTask(title) {
    const child = new Task(title, this);
    this.children.push(child);
  }
}

const CanMakeTable = {
  newTable(title) {
    const child = new Table(title, this);
    this.children.push(child);
  }
}

const HasCustomColor = {
  newColor(hex) {
    this.color = hex;
  }
}

const HasTitle = {
  newTitle(string) {
    this.title = string;
  }
}

const HasDescription = {
  newDescription(string) {
    this.description = string;
  }
}

const HasDeadline = {
  newDescription(date) {
    this.deadline = date;
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

// For Testing

const tableTemplate = ["Ideas", "To Do", "Doing", "Done"];
const tableColors = ["#ffe600", "#00ff00", "#00ccff", "#ff6600"]

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

const placeholderProjectsJson = '[{ "title": "Todo List App", "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua" }, { "title": "Placeholder One" }, { "title": "Placeholder Two" }]'