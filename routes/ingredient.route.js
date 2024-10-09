const ingredientRoutes = (app, sql) => {
    
    
    app.get('/api/all-ingredients', async (request, response) => {
        const data = await sql`
            SELECT * FROM ingredients
            ORDER BY ingredient_name;`;
        response.send(data);
    });
    
}

module.exports = {ingredientRoutes};
