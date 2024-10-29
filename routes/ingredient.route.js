import IngredientService from "../services/ingredient.service.js";


export const ingredientRoutes = (app, sql) => {
    
    
    app.get('/api/all-ingredients', async (request, response) => {
        
        const data = await sql`
            SELECT * FROM ingredients
            ORDER BY ingredient_name;`;

        response.send(data);
        
    });


    app.get('/api/all-ingredient-categories', async (req, res) => {
        
        let data = await sql`
            SELECT DISTINCT ingredient_category
            FROM ingredients
            ORDER BY ingredient_category ASC;`;
        
        const data_list = data.map(row => row.ingredient_category);       

        res.send(data_list);

    });


    app.post('/api/new_ingredient_submitted', async (req, res) => {

        try {
            const uploadIngredient = new IngredientService(sql)
            await uploadIngredient.uploadNewIngredient((req.body), res);
        } catch (err) {
            console.log(err);
            res.status(500).send("Internal Service Error")
        }

    });


    app.patch('/api/edit-ingredient', async (req, res) => {

        try {
            const updateIngredient = new IngredientService(sql)
            await updateIngredient.updateIngredient((req.body), res);
        } catch (err) {
            console.log(err);
            res.status(500).send("Internal Service Error")
        }

    });
    
};
