import ImageService from "../services/image.service.js";
import RecipeService from "../services/recipe.service.js";


export const recipeRoutes = (app, sql, upload, bucket) => {


    app.post('/api/new_recipe_submitted', upload.single('recipe_image'), async (req, res) => {

        try {
            // Check if file-name already exists in GCS to prevent overwriting data
            const uploadRecipeImage = new ImageService(bucket);
            const imageName = req.file.originalname;
            const fileExists = await uploadRecipeImage.checkImageExists(imageName, res);

            if (!fileExists) {
                await uploadRecipeImage.uploadImage(req.file);

                const uploadRecipe = new RecipeService(sql);
                await uploadRecipe.uploadRecipeData(JSON.parse(req.body.recipe_details), res);

                res.status(201);
            };

        } catch (err) {
            console.log(err);
            res.status(500).send("Internal Service Error");
        };
    
    });

    app.get('/recipes', async (req, res) => {
        const recipes = await sql`
        SELECT test_meal_id, meal_name, gcs_file_name
        FROM test_meals`


        const RecipeImage = new ImageService(bucket);

        const asyncRes = await Promise.all(recipes.map(async rec => {
            return {   
                ...rec,
            image_url: await RecipeImage.get_image_url(rec.gcs_file_name)
            }
        }))

        res.send(asyncRes);
        res.status(200)
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
            WHERE tmm.meal_id = ${ meal_id };`;
    
    
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
        });
    
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
        };
    
        res.send(data);
    
    });
    
};
