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
    const myActiveProject = localStorage.getItem("activeProject");

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
    controller.setActiveProject(myActiveProject);
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
    localStorage.setItem("activeProject", projects.indexOf(this.getActiveProject()));
    console.log("Succesfully saved data to localStorage");
  },

  loadDefaultProject: function () {
    console.log("localStorage data could not be found or parsed.");

    const savedProjects = JSON.parse(JSON.stringify(defaultTemplate.myProjects));
    const savedTables = JSON.parse(JSON.stringify(defaultTemplate.myTables));
    const savedTasks = JSON.parse(JSON.stringify(defaultTemplate.myTasks));

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
    controller.setActiveProject(defaultTemplate.activeProject);
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

const CanDeleteChild = {
  deleteChild(index) {
    this.children.splice(index, 1);
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

Object.assign(Project.prototype, CanMakeTable, CanDeleteChild);

class Table {
  constructor(title, parent) {
    this.title = title;
    this.parentId = parent.id;
    this.id = Math.random();
  }
  children = [];
  setParent(object) {
    this.parentId = object.id;
  }
  insert(object) {
    this.children.push(object);
  }
  get parentObject() {
    const parent = projects.find(obj => obj.id === this.parentId);
    return parent;
  }
}

Object.assign(Table.prototype, CanMakeTask, HasCustomColor, CanDeleteChild);

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

// const tableTemplate = ["To Do", "Doing", "Done"];
// const tableColors = ["#ffe600", "#00ff00", "#00ccff"]

// const taskTemplate1 = ["Animations", "Notepad", "Dark Mode", "Task Labels", "UI Redesign"];
// const taskTemplate2 = ["Deadlines", "Form input",];
// const taskTemplate3 = ["Drag & Drop", "Basic Styling", "localStorage Saving",];
// const taskTemplates = [taskTemplate1, taskTemplate2, taskTemplate3];

// controller.newProject("To Do List Webapp", "Here's an example use case of my To Do List webapp. Drag & Drop tasks between tables to keep a visual track of your work. Everything is customizable, from the Project to the Tables and the Tasks inside them. Any modifications you make will be saved when you return!");

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

// controller.saveToLocalStorage();

const defaultTemplate = {
  myProjects: ["{\"children\":[{\"children\":[{\"title\":\"Animations\",\"parentId\":0.9747654657543479},{\"title\":\"Notepad\",\"parentId\":0.9747654657543479},{\"title\":\"Dark Mode\",\"parentId\":0.9747654657543479},{\"title\":\"Task Labels\",\"parentId\":0.9747654657543479},{\"title\":\"UI Redesign\",\"parentId\":0.9747654657543479}],\"title\":\"To Do\",\"parentId\":0.6093726341126866,\"id\":0.9747654657543479,\"color\":\"#ffe600\"},{\"children\":[{\"title\":\"Deadlines\",\"parentId\":0.055323889647122204},{\"title\":\"Form input\",\"parentId\":0.055323889647122204}],\"title\":\"Doing\",\"parentId\":0.6093726341126866,\"id\":0.055323889647122204,\"color\":\"#00ff00\"},{\"children\":[{\"title\":\"Drag & Drop\",\"parentId\":0.04907452836744297},{\"title\":\"Basic Styling\",\"parentId\":0.04907452836744297},{\"title\":\"localStorage Saving\",\"parentId\":0.04907452836744297}],\"title\":\"Done\",\"parentId\":0.6093726341126866,\"id\":0.04907452836744297,\"color\":\"#00ccff\"}],\"title\":\"To Do List Webapp\",\"description\":\"Stay organized with a visual Kanban-style To Do list that'll help you track tasks and their status within your projects. Drag and Drop to reorganize tables and the tasks inside them. Start fresh with a new project, or tweak this one to fit your needs. Everything from projects to tasks are customizable, and your changes will be saved for when you come back!\",\"id\":0.6093726341126866}"],
  myTables: ["{\"children\":[{\"title\":\"Animations\",\"parentId\":0.9747654657543479},{\"title\":\"Notepad\",\"parentId\":0.9747654657543479},{\"title\":\"Dark Mode\",\"parentId\":0.9747654657543479},{\"title\":\"Task Labels\",\"parentId\":0.9747654657543479},{\"title\":\"UI Redesign\",\"parentId\":0.9747654657543479}],\"title\":\"To Do\",\"parentId\":0.6093726341126866,\"id\":0.9747654657543479,\"color\":\"#ffe600\"}", "{\"children\":[{\"title\":\"Deadlines\",\"parentId\":0.055323889647122204},{\"title\":\"Form input\",\"parentId\":0.055323889647122204}],\"title\":\"Doing\",\"parentId\":0.6093726341126866,\"id\":0.055323889647122204,\"color\":\"#00ff00\"}", "{\"children\":[{\"title\":\"Drag & Drop\",\"parentId\":0.04907452836744297},{\"title\":\"Basic Styling\",\"parentId\":0.04907452836744297},{\"title\":\"localStorage Saving\",\"parentId\":0.04907452836744297}],\"title\":\"Done\",\"parentId\":0.6093726341126866,\"id\":0.04907452836744297,\"color\":\"#00ccff\"}"],
  myTasks: ["{\"title\":\"Animations\",\"parentId\":0.9747654657543479}", "{\"title\":\"Notepad\",\"parentId\":0.9747654657543479}", "{\"title\":\"Dark Mode\",\"parentId\":0.9747654657543479}", "{\"title\":\"Task Labels\",\"parentId\":0.9747654657543479}", "{\"title\":\"UI Redesign\",\"parentId\":0.9747654657543479}", "{\"title\":\"Deadlines\",\"parentId\":0.055323889647122204}", "{\"title\":\"Form input\",\"parentId\":0.055323889647122204}", "{\"title\":\"Drag & Drop\",\"parentId\":0.04907452836744297}", "{\"title\":\"Basic Styling\",\"parentId\":0.04907452836744297}", "{\"title\":\"localStorage Saving\",\"parentId\":0.04907452836744297}"],
  activeProject: 0,
}

const blankTemplate = {
  myProjects: ["{\"children\":[{\"children\":[{\"title\":\"Animations\",\"parentId\":0.9747654657543479},{\"title\":\"Notepad\",\"parentId\":0.9747654657543479},{\"title\":\"Dark Mode\",\"parentId\":0.9747654657543479},{\"title\":\"Task Labels\",\"parentId\":0.9747654657543479},{\"title\":\"UI Redesign\",\"parentId\":0.9747654657543479}],\"title\":\"To Do\",\"parentId\":0.6093726341126866,\"id\":0.9747654657543479,\"color\":\"#ffe600\"},{\"children\":[{\"title\":\"Deadlines\",\"parentId\":0.055323889647122204},{\"title\":\"Form input\",\"parentId\":0.055323889647122204}],\"title\":\"Doing\",\"parentId\":0.6093726341126866,\"id\":0.055323889647122204,\"color\":\"#00ff00\"},{\"children\":[{\"title\":\"Drag & Drop\",\"parentId\":0.04907452836744297},{\"title\":\"Basic Styling\",\"parentId\":0.04907452836744297},{\"title\":\"localStorage Saving\",\"parentId\":0.04907452836744297}],\"title\":\"Done\",\"parentId\":0.6093726341126866,\"id\":0.04907452836744297,\"color\":\"#00ccff\"}],\"title\":\"To Do List Webapp\",\"description\":\"Stay organized with a visual Kanban-style layout that helps you track tasks and their status within your projects. Drag and Drop to reorganize tables and the tasks inside them. Start fresh with a new project, or tweak this one to fit your needs. Everything from projects to tasks are customizable, and your changes will be saved for when you come back!\",\"id\":0.6093726341126866}"],
  myTables: ["{\"children\":[{\"title\":\"Animations\",\"parentId\":0.9747654657543479},{\"title\":\"Notepad\",\"parentId\":0.9747654657543479},{\"title\":\"Dark Mode\",\"parentId\":0.9747654657543479},{\"title\":\"Task Labels\",\"parentId\":0.9747654657543479},{\"title\":\"UI Redesign\",\"parentId\":0.9747654657543479}],\"title\":\"To Do\",\"parentId\":0.6093726341126866,\"id\":0.9747654657543479,\"color\":\"#ffe600\"}", "{\"children\":[{\"title\":\"Deadlines\",\"parentId\":0.055323889647122204},{\"title\":\"Form input\",\"parentId\":0.055323889647122204}],\"title\":\"Doing\",\"parentId\":0.6093726341126866,\"id\":0.055323889647122204,\"color\":\"#00ff00\"}", "{\"children\":[{\"title\":\"Drag & Drop\",\"parentId\":0.04907452836744297},{\"title\":\"Basic Styling\",\"parentId\":0.04907452836744297},{\"title\":\"localStorage Saving\",\"parentId\":0.04907452836744297}],\"title\":\"Done\",\"parentId\":0.6093726341126866,\"id\":0.04907452836744297,\"color\":\"#00ccff\"}"],
  myTasks: ["{\"title\":\"Animations\",\"parentId\":0.9747654657543479}", "{\"title\":\"Notepad\",\"parentId\":0.9747654657543479}", "{\"title\":\"Dark Mode\",\"parentId\":0.9747654657543479}", "{\"title\":\"Task Labels\",\"parentId\":0.9747654657543479}", "{\"title\":\"UI Redesign\",\"parentId\":0.9747654657543479}", "{\"title\":\"Deadlines\",\"parentId\":0.055323889647122204}", "{\"title\":\"Form input\",\"parentId\":0.055323889647122204}", "{\"title\":\"Drag & Drop\",\"parentId\":0.04907452836744297}", "{\"title\":\"Basic Styling\",\"parentId\":0.04907452836744297}", "{\"title\":\"localStorage Saving\",\"parentId\":0.04907452836744297}"],
  activeProject: 0,
}