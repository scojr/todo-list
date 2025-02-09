import "./style.css";
import { controller } from "./logic";
import { displayHeader, resetDisplay } from "./display";
import("./form.js");

displayHeader();
resetDisplay();
// if localstorage
//   fill projects from localstorage and display
// else
//   display sample project template

window.global = function () {
  controller.exportToJson();
}