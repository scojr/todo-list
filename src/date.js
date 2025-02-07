import { format } from "date-fns";

export const getCurrentDate = (function () {
  function weekday() {
    return format(new Date(), "iii")
  }

  function day() {
    return format(new Date(), "d")
  }

  function month() {
    return format(new Date(), "MMM")
  }

  function year() {
    return format(new Date(), "y")
  }

  return { weekday, day, month, year }
})();