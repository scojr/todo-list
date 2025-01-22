import "./style.css";
import { tester } from "./logic";
import { listProjects, displayDate, displayFoldersOf } from "./display";

window.test = tester();
listProjects();
displayDate();
displayFoldersOf("makesandwich");