export const elements = (function () {

  const sidebar = (function () {
    const taskList = document.querySelector(".task-list");
    const headerDay = document.querySelector(".side-bar-day");
    const headerDate = document.querySelector(".side-bar-date");
    const addTaskButton = document.querySelector(".side-bar-add-task")
    return { taskList, headerDay, headerDate, addTaskButton };
  })();

  const container = (function () {
    const main = document.querySelector(".container");
    const weekCard = document.querySelector(".this-week-card");
    const todayCard = document.querySelector(".today-card");
    const upcomingCard = document.querySelector(".upcoming-card");
    const notesCard = document.querySelector(".notes-card");
    return { main, weekCard, todayCard, upcomingCard, notesCard };
  })();



  const addTaskModal = (function () {
    const main = document.querySelector(".add-task-modal");
    const form = document.querySelector(".add-task-form");
    const titleInput = document.querySelector(".title-input");
    const descriptionInput = document.querySelector(".description-input");
    const buttons = (function () {
      const folder = document.querySelector(".folder-button");
      const deadline = document.querySelector(".deadline-button");
      const priority = document.querySelector(".priority-button");
      const addTask = document.querySelector(".form-add-task-button");
      const close = document.querySelector(".form-cancel-button");

      return { folder, deadline, priority, addTask, close };
    })();

    return { main, form, titleInput, descriptionInput, buttons };
  })();

  return { sidebar, addTaskModal, container };

})();

export function clearChildrenOf(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}