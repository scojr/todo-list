import "./style.css";
import { controller } from "./logic";
import { displayHeader } from "./display";
// // import { listProjects, displayDate, displayFoldersOf } from "./display";

displayHeader();
// displayDate();
// displayFoldersOf(getActiveProject());


window.globalController = controller;