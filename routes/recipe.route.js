const recipeRoutes = (app, sql) => {

    app.post('/api/new_recipe_submitted', async (req, res) => {

        try {
            console.log('post request made');
            const data = req.body;
    
            const mealTypeColumns = {
                vegan: false,
                vegetarian: false,
                gluten_free: false,
                high_fodmap: false,
                low_fodmap: false,
            }
                
            data.diet.map(type => {
                mealTypeColumns[type] = true;
            })
    
            
            // sql.begin starts a new transaction such that if anything fails, ROLLBACK will be called:
            await sql.begin(async sql => {

                const db_entry = await sql`
                    INSERT INTO test_meals
                        (meal_name, cooking_time, image_url, servings, meal_type, vegan, vegetarian, gluten_free, high_fodmap, low_fodmap)
                    VALUES
                        (${data.name}, ${data.time}, ${data.image}, ${data.servings}, ${data.meal_type}, ${mealTypeColumns.vegan}, ${mealTypeColumns.vegetarian}, ${mealTypeColumns.gluten_free}, ${mealTypeColumns.high_fodmap}, ${mealTypeColumns.low_fodmap})
                    RETURNING
                        test_meal_id
                `

                const meal_pk = db_entry[0].test_meal_id;
        
                const ingredients_list = data.ingredients.map((item) => (
                    {
                        meal_id: meal_pk,
                        ingredient_id: item.ingredient_id,
                        ingredient_amount: item.amount,
                        ingredient_unit: item.unit
                    }
                ))
        
                const steps_list = Object.entries(data.steps).map((item) => (
                    {
                        meal_id: meal_pk,
                        step_number: item[0],
                        instruction: item[1]
                    }
                ))
    
                
                await sql`
                    INSERT INTO test_meal_ingredients ${ sql(ingredients_list) }
                `

                await sql`
                    INSERT INTO test_meal_methods ${ sql(steps_list) }
                `

            })

            
            res.status(201).json({ saved_data: data });
            console.log('Data added successfully to database');
    
        } catch (error) {
            console.error('Error inserting data:', error);
            res.status(500).json({ error: 'Database error' });
        }
    
    });
    
    
}

module.exports = {recipeRoutes};