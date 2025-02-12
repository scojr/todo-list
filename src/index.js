import "./style.css";
import { controller } from "./logic";
import { displayHeader, resetDisplay, display } from "./display";

if (JSON.parse(localStorage.getItem("myProjects") !== null)) {
  controller.loadFromLocalStorage();
} else {
  controller.loadDefaultProject();
}

displayHeader();
display();

