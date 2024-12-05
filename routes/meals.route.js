import { data } from "../test.js";
import ImageService from "../services/image.service.js";
import { addRemainingDays, groupByDate } from "../utils/meal.utils.js";
import { addDays, formatISO } from "date-fns";

/*
Tasks: 
- update meal at date
remove meal at date
- add meal to date
- view all meals per week
*/

export const mealsRoutes = (app, sql, bucket) => {
  app.get("/api/test", (req, res) => {
    res.send({ message: "hello" });
  });

  app.get("/api/meal_planner", (request, response) => {
    response.send(JSON.stringify(data));
    response.status(201);
  });

  app.get("/api/meal_planners", async (request, response) => {
    const user_id = 1;
    const startDate = new Date(request.query.week);
    const startDateString = formatISO(startDate, { representation: "date" });
    const endDate = addDays(startDate, 6);

    try {
      const db_data = await sql`
        SELECT tmp.scheduled_meal_date, tmp.meal_time, tmp.meal_plan_id, tm.meal_name, tm.gcs_file_name
        FROM test_meal_plan as tmp
        INNER JOIN test_meals as tm
        ON tmp.meal_id = tm.test_meal_id
        WHERE tmp.user_id = ${user_id} AND scheduled_meal_date BETWEEN ${startDate} AND ${endDate}
        ORDER BY tmp.scheduled_meal_date, tmp.meal_time;
      `;

      // Get image URL for each meal
      const MealImage = new ImageService(bucket);
      const db_data_with_url = await Promise.all(
        db_data.map(async (meal) => {
          const image_url = await MealImage.get_image_url(meal.gcs_file_name);
          return {
            ...meal,
            image_url,
          };
        })
      );

      const groupedMealPlanData = groupByDate(db_data_with_url);
      const mealPlanData = addRemainingDays(
        startDateString,
        groupedMealPlanData
      );

      response.send({ weekCommencing: startDateString, meals: mealPlanData });
      response.status(200);
    } catch (error) {
      console.error(error);
    }
  });

  app.post("/api/schedule_meal", async (request, response) => {
    const { user_id, meal_id, scheduled_meal_date, meal_time } = request.body;

    try {
      const db_entry = await sql`
          INSERT INTO test_meal_plan
            (user_id, meal_id, scheduled_meal_date, meal_time)
          VALUES
            (${user_id}, ${meal_id}, ${scheduled_meal_date}, ${meal_time})
          `;
      console.log("successfully added meal plan to db");
      response.status(201);
    } catch (error) {
      console.error(error);
      response.status(500);
    }
  });

  app.patch("/api/schedule_meal", async (request, response) => {
    const { user_id, meal_id, scheduled_meal_date, meal_time } = request.body;

    try {
      const [get_record] = await sql`
        SELECT EXISTS (
            SELECT 1 FROM test_meal_plan
            WHERE
              user_id=${user_id} AND scheduled_meal_date=${scheduled_meal_date} AND meal_time=${meal_time}
        )
      `;

      if (get_record.exists) {
        const db_entry = await sql`
            UPDATE test_meal_plan
            SET
              meal_id = ${meal_id}
            WHERE
              user_id=${user_id} AND scheduled_meal_date=${scheduled_meal_date} AND meal_time=${meal_time}
        `;

        console.log("successfully updated meal plan in db");
        response.status();
      } else {
        response.status(400);
        response.json({
          message: "Unable to find the following record",
          user: user_id,
          date: scheduled_meal_date,
          time: meal_time,
        });
      }
    } catch (error) {
      console.error(error);
      response.status(500);
    }
  });
};
