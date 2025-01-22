import { format } from "date-fns";

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