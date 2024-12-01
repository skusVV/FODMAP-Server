import { capitalise } from "../services/normalisation.service.js";

export const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function groupBy(array) {
  // Groups database array by day of the week and meal
  const groups = {};
  for (let item of array) {
    const day = item.scheduled_meal_date.getDay();
    const weekday = weekdays[day - 1];
    const time = capitalise(item.meal_time);

    const item_details = {
      meal_plan_id: item.meal_plan_id,
      meal_name: item.meal_name,
      image_url: item.image_url,
    };

    if (!groups[weekday]) {
      groups[weekday] = { [time]: item_details };
    } else {
      groups[weekday][time] = item_details;
    }
  }
  return groups;
}

export function addAllDays(array) {
  for (let day of weekdays) {
    if (!array[day]) {
      array[day] = {};
    }
  }
}
