import { uploadImage } from "../services/image.service.js";

export const recipeRoutes = (app, sql, upload) => {

    // function uploadImage(imageData) {
    //     console.log("Image upload triggered");
    
    //     const imageBuffer = imageData.buffer;
    //     const file_name = imageData.originalname;
    //     const file_type = imageData.mimetype;
    //     const file = bucket.file(file_name);
    //     const options = {
    //         resumable: false,
    //         metadata: {
    //             contentType: file_type,
    //         }};

    //     return new Promise ((resolve, reject) => {
    //         file.save(imageBuffer, options, function(err) {
    //             if (!err) {
    //                 console.log(`File: ${file_name} has been uploaded to bucket`);
    //                 resolve()
    //             } else {
    //                 console.log('Error uploading image to bucket');
    //                 reject(err)
    //             };
    //         });

    //     })
    // };

    async function uploadRecipeData(recipe_data, res) {
        try {
            console.log('Recipe detail upload triggered');
    
            const mealTypeColumns = {
                vegan: false,
                vegetarian: false,
                gluten_free: false,
                high_fodmap: false,
                low_fodmap: false,
            }
                
            recipe_data.diet.map(type => {
                mealTypeColumns[type] = true;
            });
            
            // sql.begin starts a new transaction such that if anything fails, ROLLBACK will be called:
            await sql.begin(async sql => {

                const db_entry = await sql`
                    INSERT INTO test_meals
                        (meal_name, cooking_time, gcs_file_name, servings, meal_type, vegan, vegetarian, gluten_free, high_fodmap, low_fodmap)
                    VALUES
                        (${recipe_data.name}, ${recipe_data.time}, ${recipe_data.image}, ${recipe_data.servings}, ${recipe_data.meal_type}, ${mealTypeColumns.vegan}, ${mealTypeColumns.vegetarian}, ${mealTypeColumns.gluten_free}, ${mealTypeColumns.high_fodmap}, ${mealTypeColumns.low_fodmap})
                    RETURNING
                        test_meal_id
                `

                const meal_pk = db_entry[0].test_meal_id;
        
                const ingredients_list = recipe_data.ingredients.map((item) => (
                    {
                        meal_id: meal_pk,
                        ingredient_id: item.ingredient_id,
                        ingredient_amount: item.amount,
                        ingredient_unit: item.unit
                    }
                ))
        
                const steps_list = Object.entries(recipe_data.steps).map((item) => (
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

                res.status(201).json({ saved_data: recipe_data });
                console.log('Data added successfully to database');

            })
              
        } catch (error) {
            console.error('Error inserting data:', error);
            res.status(500).json({ error: 'Database error' });
        }
        
    };

    

    app.post('/api/new_recipe_submitted', upload.single('recipe_image'), async (req, res) => {

        // console.log(req.body.recipe_details);
        // console.log(req.file);
        try {
            await uploadImage(req.file);

            await uploadRecipeData(JSON.parse(req.body.recipe_details), res);

            res.status(201)

        } catch (err) {
            console.log(err);
            res.status(500).send("Internal Service Error")
        };
    
    });



    app.get('/recipe-id/:id', async (req, res) => {

        const meal_id =req.params.id;
      
        const details = await sql`
                SELECT * FROM test_meals
                WHERE test_meal_id = ${ meal_id };`;
        
        const ingredients = await sql`
            SELECT i.ingredient_name, i.ingredient_detail, tmi.ingredient_amount, tmi.ingredient_unit
            FROM test_meal_ingredients AS tmi INNER JOIN ingredients as I
            ON tmi.ingredient_id = i.ingredient_id
            WHERE tmi.meal_id = ${ meal_id };`;
    
        const methods = await sql`
            SELECT step_number, instruction
            FROM test_meal_methods as tmm
            WHERE tmm.meal_id = 70;`;
    
    
        const methodArray = methods.map( step => step.instruction);
        const ingredientArray = ingredients.map( step => step);
    
        const detailsObj = details[0];
    
    
        const dietArray = ['vegetarian', 'vegan', 'gluten_free', 'low_fodmap', 'high_fodmap'];
    
      
        let keys = Object.keys(detailsObj);
        const diet_types = [];
    
        keys.forEach((key) => {
            if (dietArray.includes(key)) {
                if (detailsObj[key] === true) {
                    diet_types.push(key);
                }
            }
        }) ;
    
    
        // Generate a URL that allows temporary access to image
        const file = bucket.file(detailsObj.gcs_file_name);
    
        const imgConfig = {
            action: 'read',
            expires: Date.now() + 1000 * 60 * 60, // one hour
        };
    
        const image_url = await file.getSignedUrl(imgConfig).then(function(data) {
            return data[0];
            });
    
    
    
        const data = {
            meal_name: detailsObj.meal_name,
            image_url: image_url,
            cooking_time: detailsObj.cooking_time,
            diet_type: diet_types,
            servings: detailsObj.servings,
            ingredients: ingredientArray,
            steps: methodArray
        }
    
        res.send(data);
    
    })
    
};



// module.exports = {recipeRoutes};