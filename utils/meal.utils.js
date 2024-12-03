import { addDays, formatISO } from "date-fns";
import { capitalise } from "./global.utils.js";

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function groupByDate(array) {
  // Groups database array by day of the week and meal

  const groups = {};
  for (let item of array) {
    const date = formatISO(item.scheduled_meal_date, {
      representation: "date",
    });
    const time = capitalise(item.meal_time);

    const item_details = {
      meal_plan_id: item.meal_plan_id,
      meal_name: item.meal_name,
      image_url: item.image_url,
    };

    if (!groups[date]) {
      groups[date] = { [time]: item_details };
    } else {
      groups[date][time] = item_details;
    }
  }
  return groups;
}

export function addRemainingDays(startDate, array) {
  const firstDay = new Date(startDate);
  const days = [];

  for (let i = 0; i < 7; i++) {
    const fullDate = addDays(firstDay, i);
    const dateString = formatISO(fullDate, {
      representation: "date",
    });
    days.push(dateString);
  }

  for (let day of days) {
    if (!array[day]) {
      array[day] = {};
    }
  }

  return array;
}
