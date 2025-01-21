const tasks = [];
const folders = [];

class Task {
  constructor(title, description, deadline) {
    this.title = title;
    this.description = description;
    this.deadline = deadline;
    this.id = filterString(title);
    this.folder = undefined;
  }
  set setFolder(folderIndex) {
    this.folder = folders[folderIndex];
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
  tasks[taskIndex].setFolder = folderIndex;
  folders[folderIndex].insert(tasks[taskIndex]);
}

export function getTasks() {
  return tasks;
}

export function getTasksByDate() {
  return tasks.toSorted(function (a, b) {
    const keyA = new Date(a.deadline),
      keyB = new Date(b.deadline);

    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });
}

export function getUnsortedTasks() {
  const unsortedTasks = [];
  tasks.forEach((task) => {
    if (task.folder === undefined) {
      unsortedTasks.push(task);
    }
  })
  return unsortedTasks;
}

export function getFolders() {
  return folders;
}

// Placeholder items
const placeHolderTasks = [
  { title: "Pick up medicine!!!", deadline: "2025-01-31" },
  { title: "Submit project report", deadline: "2025-01-31", folder: "work" },
  { title: "Prepare presentation slides", deadline: "2025-01-31", folder: "work" },
  { title: "DONUTS ON SALE", deadline: "2025-01-31" },
  { title: "Schedule meeting", deadline: "2025-01-31", folder: "work" },
  { title: "Make dentist appointment", deadline: "2025-01-31", folder: "personal" },
  { title: "Research new information", deadline: "2025-01-31", folder: "personal" },
  { title: "Pay utilities", deadline: "2025-06-01", folder: "chores" },
  { title: "Book holiday flight", deadline: "2025-02-01", folder: "personal" },
  { title: "Grocery shopping", deadline: "2025-01-02", folder: "chores" },
  { title: "Take out trash", deadline: "2025-05-25", folder: "chores" },
  { title: "Wash dishes", deadline: "2025-03-13", folder: "chores" },
  { title: "Research tickets", deadline: "2025-04-03", folder: "personal" },
  { title: "Buy supplies for project", deadline: "2025-01-31", folder: "shopping" },
  { title: "30-minute jog", deadline: "2025-01-23", folder: "hobbies" },
  { title: "Organize closet", deadline: "2025-01-27", folder: "personal" },
  { title: "Water plants", deadline: "2025-01-20", folder: "chores" },
  { title: "Read chapter of current book", deadline: "2025-01-31", folder: "hobbies" },
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
    newTask(task.title, "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", task.deadline);
    if (task.folder) {
      taskToFolder(getTaskIndexFromTitle(task.title), getFolderIndexFromTitle(task.folder))
    }
  }
})();

console.log({ tasks, folders });