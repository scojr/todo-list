import "./style.css";
import { controller } from "./logic";
import { displayHeader, resetDisplay, display } from "./display";

if (JSON.parse(localStorage.getItem("myProjects") !== null)) {
  controller.loadFromLocalStorage();
  console.log("Data loaded from localStorage");
} else {
  controller.loadDefaultProject();
  console.log("localStorage data could not be fetched, loading default project.");
}

displayHeader();
display();

