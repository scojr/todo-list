const tasks = [];

class Task {
  constructor(objective, details, deadline) {
    this.title = objective;
    this.details = details;
    this.date = deadline;
  }
}

export function newTask(objective, details, deadline) {
  const task = new Task(objective, details, deadline);
  tasks.push(task);
}

export function getTasks() {
  return tasks;
}

newTask("clean room", "clean up my roomn", "tonight");

console.log(getTasks());