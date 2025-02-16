import { dom } from "./dom-interface";
import { controller } from "./logic";
import { displayHeader, refreshHeader, resetDisplay } from "./display";
import newFolderIcon from "./icons/folder.svg";
import editFolderIcon from "./icons/folder-edit.svg";

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

// Project form

const headerText = dom.newProjectContainer.querySelector("h2");
const headerIcon = dom.newProjectContainer.querySelector("img");

const cancelButton = dom.newProjectContainer.querySelector(".new-project-cancel");
const submitButton = dom.newProjectContainer.querySelector(".new-project-submit");
const deleteButton = dom.newProjectContainer.querySelector(".new-project-delete");

const titleInput = dom.newProjectContainer.querySelector(".new-project-title-input");
const descriptionInput = dom.newProjectContainer.querySelector("textarea");
const deadlineInput = dom.newProjectContainer.querySelector("input[type='date']");
const templateInput = dom.newProjectContainer.querySelector("input[type='checkbox']");
const templateLabel = dom.newProjectContainer.querySelector(".template-label");

const invalidMessage = dom.newProjectContainer.querySelector(".project-invalid-message");

let isEditCheck = false;

function closeForm(e) {
  dom.newProjectBackground.style.visibility = "hidden";
  invalidMessage.style.display = "none";
  deleteButton.style.display = "none";

  titleInput.value = ""
  descriptionInput.value = ""
  deadlineInput.value = ""
  templateInput.checked = true;
  resetDisplay();
}

cancelButton.addEventListener("click", closeForm);
dom.newProjectBackground.addEventListener("mousedown", (e) => {
  if (!dom.newProjectContainer.matches(":hover")) {
    closeForm();
  }
});

deleteButton.addEventListener("click", deleteProjectConfirm);

// New project form

export function newProjectClick() {
  headerText.textContent = "New Project";
  headerIcon.src = newFolderIcon;
  invalidMessage.style.display = "none";
  dom.newProjectBackground.style.visibility = "visible";

  titleInput.focus();

  submitButton.textContent = "Create Project";
  submitButton.addEventListener("click", addProject);


  templateLabel.style.display = "block";
  templateInput.style.display = "block";

  function addProject() {
    if (isEditCheck === false) {
      if (titleInput.value) {
        submitButton.removeEventListener("click", addProject);
        controller.newProject(titleInput.value, descriptionInput.value)

        const newArray = controller.getProjects()[controller.getProjects().length - 1];

        if (deadlineInput.value) {
          newArray.deadline = deadlineInput.value;
        }

        if (templateInput.checked) {
          const tableTitleTemplate = ["Ideas", "Todo", "Doing", "Done"]
          const tableColorTemplate = ["#ffe600", "#00ff00", "#00ccff", "#ff8000"]

          for (const title of tableTitleTemplate) {
            newArray.newTable(title);
            newArray.children[tableTitleTemplate.indexOf(title)].color = tableColorTemplate[tableTitleTemplate.indexOf(title)]
          }

        }
        controller.setActiveProject(controller.getProjects().length - 1);
        refreshHeader();
        closeForm();
      } else {
        invalidMessage.style.display = "inline";
      }
    }
  }
}

// Edit project form

dom.projectEditButton.addEventListener("click", editProjectClick);

function editProjectClick() {
  isEditCheck = true;

  headerText.textContent = "Edit Project";
  headerIcon.src = editFolderIcon;

  invalidMessage.style.display = "none";
  templateLabel.style.display = "none";
  templateInput.style.display = "none";

  dom.newProjectBackground.style.visibility = "visible";
  deleteButton.style.display = "inline";

  submitButton.textContent = "Apply Changes";

  titleInput.value = controller.getActiveProject().title;
  descriptionInput.value = controller.getActiveProject().description;

  if (controller.getActiveProject().deadline) {
    deadlineInput.value = controller.getActiveProject().deadline;
  }

  submitButton.addEventListener("click", applyProjectEdits);
}

function applyProjectEdits() {
  if (isEditCheck === true) {
    const activeProject = controller.getActiveProject();
    if (titleInput.value) {
      submitButton.removeEventListener("click", applyProjectEdits);
      activeProject.title = titleInput.value;
      activeProject.description = descriptionInput.value;

      if (deadlineInput.value) {
        activeProject.deadline = deadlineInput.value;
      }
      refreshHeader();
      closeForm();
      isEditCheck = false;
    } else if (!titleInput.value) {
      invalidMessage.style.display = "inline";
    }
  }
}

// Delete project confirmation

const confirmProjectDeleteButton = dom.confirmDeleteProjectContainer.querySelector(".delete-project-confirmation-button");
const cancelProjectDeleteButton = dom.confirmDeleteProjectContainer.querySelector(".delete-project-cancel-button");

cancelProjectDeleteButton.addEventListener("click", () => {
  dom.confirmDeleteProjectBackground.style.visibility = "hidden";
})

dom.confirmDeleteProjectBackground.addEventListener("mousedown", (e) => {
  if (!dom.confirmDeleteProjectContainer.matches(":hover")) {
    dom.confirmDeleteProjectBackground.style.visibility = "hidden";
  }
});

confirmProjectDeleteButton.addEventListener("click", () => {
  const currentProjectIndex = controller.getProjects().indexOf(controller.getActiveProject());

  controller.getProjects().splice(currentProjectIndex, 1);
  dom.confirmDeleteProjectBackground.style.visibility = "hidden";
  controller.setActiveProject(currentProjectIndex - 1);
  refreshHeader();
  resetDisplay();
})

function deleteProjectConfirm() {
  closeForm();
  dom.confirmDeleteProjectBackground.style.visibility = "visible";
}

// Tooltip hover

const templateTooltip = dom.newProjectContainer.querySelector(".template-tooltip");
const deadlineTooltip = dom.newProjectContainer.querySelector(".deadline-tooltip");
const tooltipMessage = dom.get(".new-project-tooltip");

templateTooltip.addEventListener("mouseover", (e) => {
  const message = "Auto fill the project with tables 'Ideas', 'To Do', 'Doing', and 'Done'. <br>Project will be empty if left unchecked.";

  tooltipHover(e, message)
});
deadlineTooltip.addEventListener("mouseover", (e) => {
  const message = "Not yet implemented :)";

  tooltipHover(e, message)
});

templateTooltip.addEventListener("mouseout", tooltipOut);
deadlineTooltip.addEventListener("mouseout", tooltipOut);


function tooltipHover(e, text) {
  tooltipMessage.querySelector("p").innerHTML = text;
  tooltipMessage.style.visibility = "visible";
  tooltipMessage.style.opacity = "100%";
  tooltipMessage.style.left = e.clientX + "px";
  tooltipMessage.style.top = e.clientY + "px";
}

function tooltipOut(e) {
  tooltipMessage.style.opacity = "0%";
}