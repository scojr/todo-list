let projects = [];
let activeProject = "";

export const controller = {
  newProject: function (name, description) {
    const newProject = new Project(name, description);
    projects.push(newProject);
  },

  getProjects: function () {
    return projects;
  },

  setActiveProject: function (index) {
    activeProject = projects[index];
  },

  getActiveProject: function () {
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

  loadFromLocalStorage: function () {
    const savedProjects = JSON.parse(localStorage.getItem("myProjects"));
    const savedTables = JSON.parse(localStorage.getItem("myTables"));
    const savedTasks = JSON.parse(localStorage.getItem("myTasks"));

    const parsedProjects = [];
    const parsedTables = [];
    const parsedTasks = [];

    for (const task of savedTasks) {
      const parsedTask = JSON.parse(task);
      parsedTasks.push(parsedTask);
    }

    for (const project of savedProjects) {
      const parsedProject = JSON.parse(project);
      parsedProjects.push(parsedProject);
      const newProject = new Project(parsedProject.title, parsedProject.description);
      projects.push(newProject);
    }

    for (const table of savedTables) {
      const parsedTable = JSON.parse(table);
      parsedTables.push(parsedTable);
      for (const project of parsedProjects) {
        const index = parsedProjects.indexOf(project);
        if (parsedTable.parentId === project.id) {
          const newTable = new Table(parsedTable.title, projects[index]);
          newTable.color = parsedTable.color;
          projects[index].insert(newTable);
          for (const task of parsedTasks) {
            if (task.parentId === parsedTable.id) {
              const newTask = new Task(task.title, newTable);
              newTable.insert(newTask);
            }
          }
        }
      }
    }
  },

  saveToLocalStorage: function () {
    const myProjects = [];
    const myTables = [];
    const myTasks = [];
    for (const project of projects) {
      myProjects.push(JSON.stringify(project));
      for (const table of project.children) {
        myTables.push(JSON.stringify(table));
        for (const task of table.children) {
          myTasks.push(JSON.stringify(task));
        }
      }
    }
    localStorage.setItem("myProjects", JSON.stringify(myProjects));
    localStorage.setItem("myTables", JSON.stringify(myTables));
    localStorage.setItem("myTasks", JSON.stringify(myTasks));
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

// Classes

class Project {
  constructor(title, description) {
    this.title = title;
    this.description = description;
    this.id = Math.random();
  }
  children = [];
  deadline;
  get children() {
    return this.children;
  }
  insert(object) {
    this.children.push(object);
  }
}

Object.assign(Project.prototype, CanMakeTable);

class Table {
  constructor(title, parent) {
    this.title = title;
    this.parentId = parent.id;
    this.id = Math.random();
  }
  children = [];
  setParent(object) {
    this.parentObject = object;
  }
  insert(object) {
    this.children.push(object);
  }
  get parentObject() {
    const parent = projects.find(obj => obj.id === this.parentId);
    return parent;
  }
}

Object.assign(Table.prototype, CanMakeTask, HasCustomColor);

class Task {
  constructor(title, parent) {
    this.title = title;
    this.parentId = parent.id
  }
  setParent(object) {
    this.parentId = object.id;
  }
  get parentObject() {
    const parent = controller.getActiveProject().children.find(obj => obj.id === this.parentId);
    return parent;
  }

}

// For Testing

// const tableTemplate = ["Ideas", "To Do", "Doing", "Done"];
// const tableColors = ["#ffe600", "#00ff00", "#00ccff", "#ff6600"]

// const taskTemplate1 = ["animation", "notepad", "dark mode", "custom themes",];
// const taskTemplate2 = ["deadlines", "priority status", "labels", "project form", "folder form", "localStorage saving", "project data to json", "color",];
// const taskTemplate3 = ["todo form",];
// const taskTemplate4 = ["drag & drop todos", "basic styling",];
// const taskTemplates = [taskTemplate1, taskTemplate2, taskTemplate3, taskTemplate4];

// controller.newProject("Todo List App", "", true);
// projects[0].description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
// controller.newProject("Placeholder One", "", true);
// controller.newProject("Placeholder Two", "", true);

// activeProject = projects[0];

// for (const table of tableTemplate) {
//   controller.getProjectByIndex(0).newTable(table);
//   for (const taskTemplate of taskTemplates[tableTemplate.indexOf(table)]) {
//     controller.getProjectByIndex(0).children[tableTemplate.indexOf(table)].newTask(taskTemplate);
//   }
// }

// for (const color of tableColors) {
//   const index = tableColors.indexOf(color);
//   controller.getActiveProject().children[index].newColor(color);
// }

// const placeholderProjectsJson = '[{ "title": "Todo List App", "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua" }, { "title": "Placeholder One" }, { "title": "Placeholder Two" }]'