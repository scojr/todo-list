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
    const dailyCard = document.querySelector(".daily-card");
    const todayCard = document.querySelector(".today-card");
    const upcomingCard = document.querySelector(".upcoming-card");
    const notesCard = document.querySelector(".notes-card");
    return { main, dailyCard, todayCard, upcomingCard, notesCard };
  })();

  const addTaskModal = document.querySelector(".add-task-modal");

  return { sidebar, addTaskModal, container };

})();

export function clearChildrenOf(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}