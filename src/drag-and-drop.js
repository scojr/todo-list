
export function enableDragAndDrop(element) {
  element.addEventListener("mousedown", (event) => elementDragging(event, element));
}

function elementDragging(event, element) {
  event.preventDefault();

  let activeFolders = document.querySelectorAll(".folder")
  let hoveredFolder = event.currentTarget.parentElement.parentElement;
  let hoveredTodo = event.currentTarget;
  let grabbedTodo = event.currentTarget;

  const draggingClone = cloneElement(element);
  const parentClone = cloneParent(element);

  hoveredFolder.appendChild(folderClonedElement);
  const folderClonedElement = element.parentElement.cloneNode(true);

  element.style.setProperty("display", "none");
  document.body.style.setProperty("cursor", "grabbing", "important");


  dom.container.appendChild(draggedClonedElement);
  draggedClonedElement.style.setProperty("--mouse-x", (event.clientX - draggedClonedElement.clientWidth / 2) + "px")
  draggedClonedElement.style.setProperty("--mouse-y", (event.clientY + 24) + "px")
  document.onmousemove = dragElement;
  document.onmouseup = closeDragElement;


  function dragElement(e) {
    draggedClonedElement.style.setProperty("--mouse-x", (e.clientX - draggedClonedElement.clientWidth / 2) + "px")
    draggedClonedElement.style.setProperty("--mouse-y", (e.clientY + 24) + "px")
    for (const folder of activeFolders) {
      folder.addEventListener("mouseover", folderMouseEnter);
      folder.addEventListener("mouseleave", folderMouseLeave);
      for (const todo of folder.querySelectorAll(".todo-box:not(#folder-cloned-element)")) {
        todo.addEventListener("mouseover", todoMouseEnter)
      }
    }
  }

  function todoMouseEnter(e) {
    hoveredTodo = e.currentTarget;
    const hoveredTodoIndex = hoveredTodo.dataset.index;
    const todoBox = e.target.getBoundingClientRect();
    const y = e.y - todoBox.top;
    if (hoveredTodoIndex) {
      if (y > todoBox.height / 2) {
        // Mouse enters from bottom //
        folderClonedElement.style.setProperty("order", hoveredTodoIndex - 1);
      } else {
        // Mouse enters from top //
        folderClonedElement.style.setProperty("order", hoveredTodoIndex);
      }
    }
  }

  function folderMouseEnter(e) {
    hoveredFolder = e.currentTarget;
    hoveredFolder.appendChild(folderClonedElement);
  }

  function folderMouseLeave(e) {
    hoveredFolder = null;
    document.querySelector("#folder-cloned-element").remove();
  }

  function closeDragElement() {
    if (hoveredFolder) {
      const indexOfHoveredFolder = hoveredFolder.dataset.index;
      const placeholderIndex = parseInt(folderClonedElement.style.order) + 1;
      console.log(placeholderIndex);

      const indexOfFromFolder = grabbedTodo.parentElement.parentElement.dataset.index;
      const fromFolder = getActiveProject().folders[indexOfFromFolder]
      const indexOfGrabbedTodo = grabbedTodo.dataset.index;

      console.log({ fromFolder, grabbedTodo, hoveredFolder })

      fromFolder.transferTodo(indexOfGrabbedTodo, indexOfHoveredFolder, placeholderIndex);
    }
    document.onmousemove = null;
    document.onmouseup = null;
    document.body.style.cursor = "default";
    refreshContainer();
  }
  return;
}


function cloneElement(element) {
  const clone = element.cloneNode(true);
  clone.style.setProperty("width", `${element.clientWidth}px`);
  clone.style.setProperty("height", `${element.clientWidth}px`);
  return clone;
}

function cloneParent(element) {
  const parentclone = element.parentElement.cloneNode(true);
  parentclone.id = "folder-cloned-element";
  parentclone.firstElementChild.id = "inset"
}


// function displayTodosOf(folderTodos, domElement) {
//   const activeFolder = folderTodos.todos;
//   for (const todo of activeFolder) {
//     const card = dom.make("div");
//     card.classList.add("todo-container");
//     card.style.order = activeFolder.indexOf(todo);
//     const todoBox = dom.make("div", todo.name);
//     const todoDragIcon = dom.make("img");
//     todoDragIcon.src = dragHorizontal;
//     todoBox.classList.add("todo-box");
//     todoBox.setAttribute("data-index", activeFolder.indexOf(todo));
//     todoBox.addEventListener("mousedown", (event) => todoDragging(event, todoBox));
//     card.append(todoBox, todoDragIcon);
//     domElement.appendChild(card);
//   }
//   const todoFooter = dom.make("div");
//   const taskInput = makeInput("text", "newtask", "Add new task");
//   const footerSettings = dom.make("div");
//   footerSettings.classList.add("settings");
//   const colorSetting = dom.make("input");
//   colorSetting.type = "color";
//   const dateSetting = dom.make("input")
//   dateSetting.type = "date";
//   footerSettings.append(colorSetting, dateSetting)
//   const cardFooterAddButton = dom.make("button", "+");
//   cardFooterAddButton.classList.add("todo-add-button");
//   cardFooterAddButton.addEventListener("click", (e) => {
//     if (taskInput.input.value) {
//       folderTodos.newTodo(taskInput.input.value);
//       refreshContainer();
//     }
//   });
//   todoFooter.classList.add("todo-footer");
//   todoFooter.style.setProperty("order", "9999");
//   todoFooter.append(taskInput.label, footerSettings, cardFooterAddButton);
//   domElement.appendChild(todoFooter);
// }

// // Todo Dragging //
// // I promise I'll refactor this into its own module but wow it works!! //
// function todoDragging(event, element) {
//   event.preventDefault();
//   let activeFolders = document.querySelectorAll(".folder")
//   let hoveredFolder = event.currentTarget.parentElement.parentElement;
//   let hoveredTodo = event.currentTarget;
//   let grabbedTodo = event.currentTarget;

//   const draggedClonedElement = element.cloneNode(true);
//   draggedClonedElement.style.setProperty("width", `${element.clientWidth}px`);
//   draggedClonedElement.id = "dragging";
//   draggedClonedElement.setAttribute("data-index", "null");

//   const folderClonedElement = element.parentElement.cloneNode(true);
//   folderClonedElement.id = "folder-cloned-element";
//   folderClonedElement.firstElementChild.id = "inset"
//   hoveredFolder.appendChild(folderClonedElement);

//   element.parentElement.style.setProperty("display", "none");
//   document.body.style.setProperty("cursor", "grabbing", "important");
//   dom.container.appendChild(draggedClonedElement);
//   draggedClonedElement.style.setProperty("--mouse-x", (event.clientX - draggedClonedElement.clientWidth / 2) + "px")
//   draggedClonedElement.style.setProperty("--mouse-y", (event.clientY + 24) + "px")
//   document.onmousemove = dragElement;
//   document.onmouseup = closeDragElement;


//   function dragElement(e) {
//     draggedClonedElement.style.setProperty("--mouse-x", (e.clientX - draggedClonedElement.clientWidth / 2) + "px")
//     draggedClonedElement.style.setProperty("--mouse-y", (e.clientY + 24) + "px")
//     for (const folder of activeFolders) {
//       folder.addEventListener("mouseover", folderMouseEnter);
//       folder.addEventListener("mouseleave", folderMouseLeave);
//       for (const todo of folder.querySelectorAll(".todo-box:not(#folder-cloned-element)")) {
//         todo.addEventListener("mouseover", todoMouseEnter)
//       }
//     }
//   }

//   function todoMouseEnter(e) {
//     hoveredTodo = e.currentTarget;
//     const hoveredTodoIndex = hoveredTodo.dataset.index;
//     const todoBox = e.target.getBoundingClientRect();
//     const y = e.y - todoBox.top;
//     if (hoveredTodoIndex) {
//       if (y > todoBox.height / 2) {
//         // Mouse enters from bottom //
//         folderClonedElement.style.setProperty("order", hoveredTodoIndex - 1);
//       } else {
//         // Mouse enters from top //
//         folderClonedElement.style.setProperty("order", hoveredTodoIndex);
//       }
//     }
//   }

//   function folderMouseEnter(e) {
//     hoveredFolder = e.currentTarget;
//     hoveredFolder.appendChild(folderClonedElement);
//   }

//   function folderMouseLeave(e) {
//     hoveredFolder = null;
//     document.querySelector("#folder-cloned-element").remove();
//   }

//   function closeDragElement() {
//     if (hoveredFolder) {
//       const indexOfHoveredFolder = hoveredFolder.dataset.index;
//       const placeholderIndex = parseInt(folderClonedElement.style.order) + 1;
//       console.log(placeholderIndex);

//       const indexOfFromFolder = grabbedTodo.parentElement.parentElement.dataset.index;
//       const fromFolder = getActiveProject().folders[indexOfFromFolder]
//       const indexOfGrabbedTodo = grabbedTodo.dataset.index;

//       console.log({ fromFolder, grabbedTodo, hoveredFolder })

//       fromFolder.transferTodo(indexOfGrabbedTodo, indexOfHoveredFolder, placeholderIndex);
//     }
//     document.onmousemove = null;
//     document.onmouseup = null;
//     document.body.style.cursor = "default";
//     refreshContainer();
//   }
//   return;
// }