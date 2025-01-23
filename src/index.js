import "./style.css";
import { tester, getActiveProject } from "./logic";
import { listProjects, displayDate, displayFoldersOf } from "./display";

window.test = tester();
listProjects();
displayDate();
displayFoldersOf(getActiveProject());