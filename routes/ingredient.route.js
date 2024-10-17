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
        
        console.log(data);
        const data_list = data.map(row => row.ingredient_category);
        

        res.send(data_list);
        console.log(Array.isArray(data_list));
        // console.log(data_list);
    });
    
}

// module.exports = {ingredientRoutes};
