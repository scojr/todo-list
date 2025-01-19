export const elements = (function () {

  const sidebar = (function () {
    const taskList = document.querySelector(".task-list");
    const headerDay = document.querySelector(".side-bar-day");
    const headerDate = document.querySelector(".side-bar-date");
    return { taskList, headerDay, headerDate };
  })();

  return { sidebar };

})();