import { format, min, parse, formatDistanceToNow, isToday, isTomorrow, isThisWeek, isThisMonth } from "date-fns";
import { getTasksByDate } from "./tasks-handler";
import { ta } from "date-fns/locale";

export const getCurrentDate = (function () {
  function weekday() {
    return format(new Date(), "eeee")
  }

  function day() {
    return format(new Date(), "d")
  }

  function month() {
    return format(new Date(), "MMMM")
  }

  function year() {
    return format(new Date(), "y")
  }

  return { weekday, day, month, year }
})();


export function tasksByDate() {
  const tasks = getTasksByDate();

  const today = [];
  const tomorrow = [];
  const week = [];
  const month = [];
  const later = [];
  for (const task of tasks) {
    if (isToday(task.deadline)) today.push((task));
    else if (isTomorrow(task.deadline)) tomorrow.push((task));
    else if (isThisWeek(task.deadline)) week.push((task));
    else if (isThisMonth(task.deadline)) month.push((task));
    else later.push((task));
  }
  return { today, tomorrow, week, month, later };
}

console.log(tasksByDate());