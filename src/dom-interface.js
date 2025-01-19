export const elements = (function () {

  const sidebar = (function () {
    const taskList = document.querySelector(".task-list");
    const headerDay = document.querySelector(".side-bar-day");
    const headerDate = document.querySelector(".side-bar-date");
    const addTaskButton = document.querySelector(".side-bar-add-task")
    return { taskList, headerDay, headerDate, addTaskButton };
  })();

  const addTaskModal = document.querySelector(".add-task-modal");

  return { sidebar, addTaskModal };

})();