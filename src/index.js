import "./style.css";
import { controller } from "./logic";
import { displayHeader, resetDisplay } from "./display";
displayHeader();
resetDisplay();
// if localstorage
//   fill projects from localstorage and display
// else
//   display sample project template