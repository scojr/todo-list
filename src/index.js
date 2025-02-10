import "./style.css";
import { controller } from "./logic";
import { displayHeader, resetDisplay } from "./display";
import("./form.js");


// controller.loadDefaultProject();

if (JSON.parse(localStorage.getItem("myProjects"))[0]) {
  controller.loadFromLocalStorage();
} else {
  controller.loadDefaultProject();
}

displayHeader();
resetDisplay();

