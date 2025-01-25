import "./style.css";
import { getActiveProject } from "./logic";
import { listProjects, displayDate, displayFoldersOf } from "./display";

listProjects();
displayDate();
displayFoldersOf(getActiveProject());