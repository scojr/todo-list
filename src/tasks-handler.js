const tasks = [];
const folders = [];

class Task {
  constructor(title, description, deadline) {
    this.title = title;
    this.description = description;
    this.deadline = deadline;
    this.id = filterString(title);
  }
}

class Folder {
  constructor(title, description) {
    this.title = title;
    this.description = description;
    this.id = filterString(title);
  }
  tasks = [];
  get tasks() {
    return tasks;
  }
  insert(task) {
    this.tasks.push(task);
  }
}

export function newTask(objective, description, deadline) {
  const task = new Task(objective, description, deadline);
  tasks.push(task);
}

export function newFolder(title, description) {
  const folder = new Folder(title, description);
  folders.push(folder);
}

function getFolderIndexFromTitle(folderTitle) {
  if (folderTitle) {
    const id = filterString(folderTitle);
    const folderIDs = getFolders().map((folder) => folder.id);
    return folderIDs.indexOf(id);
  }
}

function getTaskIndexFromTitle(taskTitle) {
  if (taskTitle) {
    const id = filterString(taskTitle);
    const taskIDs = getTasks().map((task) => task.id);
    return taskIDs.indexOf(id);
  }
}

function filterString(string) {
  return string.toLowerCase().replaceAll(/[^A-Za-z0-9]/g, "");
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

// Placeholder items
const placeHolderTasks = [
  { title: "Submit project report", description: "", deadline: "", folder: "work" },
  { title: "Prepare presentation slides", description: "", deadline: "", folder: "work" },
  { title: "Schedule meeting", description: "", deadline: "", folder: "work" },
  { title: "Make dentist appointment", description: "", deadline: "", folder: "personal" },
  { title: "Research new information", description: "", deadline: "", folder: "personal" },
  { title: "Pay utilities", description: "", deadline: "", folder: "chores" },
  { title: "Book holiday flight", description: "", deadline: "", folder: "personal" },
  { title: "Grocery shopping", description: "", deadline: "", folder: "chores" },
  { title: "Take out trash", description: "", deadline: "", folder: "chores" },
  { title: "Wash dishes", description: "", deadline: "", folder: "chores" },
  { title: "Research tickets", description: "", deadline: "", folder: "personal" },
  { title: "Buy supplies for project", description: "", deadline: "", folder: "shopping" },
  { title: "30-minute jog", description: "", deadline: "", folder: "hobbies" },
  { title: "Organize closet", description: "", deadline: "", folder: "personal" },
  { title: "Water plants", description: "", deadline: "", folder: "chores" },
  { title: "Read chapter of current book", description: "", deadline: "", folder: "hobbies" },
];
const placeHolderFolders = [
  { title: "Work", description: "" },
  { title: "Personal", description: "" },
  { title: "Chores", description: "" },
  { title: "Shopping", description: "" },
  { title: "Hobbies", description: "" },
];

const placeholders = (function () {
  for (const folder of placeHolderFolders) {
    newFolder(folder.title)
  }
  for (const task of placeHolderTasks) {
    newTask(task.title, "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.");
    taskToFolder(getTaskIndexFromTitle(task.title), getFolderIndexFromTitle(task.folder))
  }
})();
