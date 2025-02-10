import "./style.css";
import { controller } from "./logic";
import { displayHeader, resetDisplay } from "./display";


// controller.loadDefaultProject();

if (JSON.parse(localStorage.getItem("myProjects") !== null)) {
  controller.loadFromLocalStorage();
} else {
  controller.loadDefaultProject();
}

displayHeader();
resetDisplay();

