import "./style.css";

import { newProject, newTask } from "./user-input";
import { listProjects } from "./projects-logic";
import { refreshList } from "./display-controller";

newProject("Chores", "Daily chores to complete.");

newTask(listProjects()[0], "clean room");

refreshList();