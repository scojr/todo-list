import { dom } from "./dom-interface";
import { controller } from "./logic";
import { displayHeader, refreshHeader, resetDisplay } from "./display";

const container = dom.modalContainer;


const modalBackground = document.querySelector(".modal-background");
const newTaskModal = document.querySelector(".new-task-modal");
const editTableModal = document.querySelector(".edit-table-modal");

const colorInput = document.querySelector("input[type=color]")

export function addFormEventListeners() {

  const editButtons = document.querySelectorAll(".edit-button");
  const colorInput = document.querySelectorAll(".color-input");
  const addTaskButton = document.querySelectorAll(".add-task-button");

  for (const button of editButtons) {
    button.addEventListener("click", editTable);
  }

  for (const button of colorInput) {
    button.addEventListener("input", colorTable);
  }

  for (const button of addTaskButton) {
    button.addEventListener("click", addTaskForm);
  }

}

function addTaskForm(e) {
  const tableElement = e.currentTarget.parentElement.parentElement.parentElement;
  const tableObject = controller.getActiveProject().children[tableElement.dataset.index];

  const taskInput = dom.make("input");
  taskInput.classList.add("table-task-input");
  taskInput.type = "text";
  taskInput.placeholder = "New Task";
  taskInput.style.order = 9999;

  tableElement.querySelector(".task-container").appendChild(taskInput);
  taskInput.focus();

  taskInput.addEventListener("blur", onClickAway)

  taskInput.addEventListener("keydown", (e) => {
    taskInput.removeEventListener("blur", onClickAway);
    if (e.key === "Enter") {
      if (taskInput.value) {
        newTableTask(taskInput.value);
      } else {
        taskInput.remove();
      }
    } else if (e.key === "Escape") {
      taskInput.remove();
    }
  })

  function onClickAway() {
    if (taskInput.value) {
      newTableTask(taskInput.value);
    } else {
      taskInput.remove();
    }
  }

  function newTableTask(string) {
    tableObject.newTask(string);
    resetDisplay();
  }
}


function colorTable(e) {
  const tableElement = e.currentTarget.parentElement.parentElement.parentElement.parentElement;
  const tableObject = controller.getActiveProject().children[tableElement.dataset.index];
  tableElement.querySelector(".table-header").style.setProperty("background-color", e.target.value);
  tableObject.color = e.target.value;
}

function editTable(e) {
  const tableElement = e.currentTarget.parentElement.parentElement.parentElement;
  const tableObject = controller.getActiveProject().children[tableElement.dataset.index];

  console.log(tableObject);
  const titleInput = dom.make("input");
  titleInput.classList.add("table-text-input");
  titleInput.type = "text";
  titleInput.value = tableObject.title;

  const tableTitleElement = tableElement.querySelector("h2");

  tableTitleElement.style.visibility = "hidden";
  tableElement.querySelector(".table-header").appendChild(titleInput);
  titleInput.focus();

  titleInput.addEventListener("blur", onClickAway)

  titleInput.addEventListener("keydown", (e) => {
    titleInput.removeEventListener("blur", onClickAway);
    if (e.key === "Enter") {
      newTableTitle(titleInput.value);
    } else if (e.key === "Escape") {
      newTableTitle(tableObject.title);
    }
  })

  function onClickAway() {
    if (titleInput.value !== tableObject.title) {
      newTableTitle(titleInput.value);
    } else {
      newTableTitle(tableObject.title);
    }
  }

  function newTableTitle(string) {
    tableObject.title = string;
    tableTitleElement.style.visibility = "visible";
    resetDisplay();
  }
}

dom.tablePlusButton.addEventListener("click", (e) => {
  addBlankTable();
})

function addBlankTable() {
  const index = controller.getActiveProject().children.length;
  const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
  controller.getActiveProject().newTable("New Table");
  controller.getActiveProject().children[index].newColor(randomColor);
  resetDisplay();
}

// New project form

export function newProjectClick() {
  dom.newProjectBackground.style.visibility = "visible";
  const cancelButton = dom.newProjectContainer.querySelector(".new-project-cancel");
  const submitButton = dom.newProjectContainer.querySelector(".new-project-submit");

  submitButton.addEventListener("click", addProject);

  function addProject() {
    const titleInput = dom.newProjectContainer.querySelector("input[type='text']")
    const descriptionInput = dom.newProjectContainer.querySelector("textarea")
    const deadlineInput = dom.newProjectContainer.querySelector("input[type='date']")
    const templateInput = dom.newProjectContainer.querySelector("input[type='checkbox']")

    if (titleInput.value) {
      console.log(titleInput.value);
      console.log(descriptionInput.value);
      controller.newProject(titleInput.value, descriptionInput.value)

      const newArray = controller.getProjects()[controller.getProjects().length - 1];

      if (deadlineInput.value) {
        newArray.deadline = deadlineInput.value;
      }

      if (templateInput.value === "true") {
        const tableTitleTemplate = ["Ideas", "To Do", "Doing", "Done"]
        const tableColorTemplate = ["#ffe600", "#00ff00", "#00ccff", "#ff8000"]

        for (const title of tableTitleTemplate) {
          newArray.newTable(title);
          newArray.children[tableTitleTemplate.indexOf(title)].color = tableColorTemplate[tableTitleTemplate.indexOf(title)]
        }
      }

    }


    refreshHeader();

    closeForm();
  }

  cancelButton.addEventListener("click", closeForm);
  dom.newProjectBackground.addEventListener("click", (e) => {
    if (!dom.newProjectContainer.matches(":hover")) {
      closeForm();
    }
  });

  function closeForm(e) {
    dom.newProjectBackground.style.visibility = "hidden";
    cancelButton.removeEventListener("click", closeForm);
  }
}