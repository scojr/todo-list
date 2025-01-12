import "./style.css";

import { newProject, newTask } from "./user-input";
import { listProjects } from "./projects-logic";

newProject("Chores", "Daily chores to complete.");

newTask(listProjects()[0], "clean room");