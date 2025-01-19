import "./style.css";
import { refreshSidebar, displayDate } from "./sidebar-controller";
import { refreshContainer } from "./container-controller.js";
import { elements } from "./dom-interface.js";

refreshSidebar();
displayDate();
refreshContainer(elements.container.dailyCard);
refreshContainer(elements.container.todayCard);
refreshContainer(elements.container.upcomingCard);