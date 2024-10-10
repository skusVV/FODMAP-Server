const express = require('express');
const cors = require('cors');
const postgres = require("postgres");
const multer = require('multer');

require('dotenv').config();


// Routes
const { ingredientRoutes } = require ('./routes/ingredient.route');
const { recipeRoutes } = require ('./routes/recipe.route')


const app = express();

const sql = postgres({
    host                 : 'localhost',                         // Postgres ip address[s] or domain name[s]
    port                 : 5432,                                // Postgres server port[s]
    database             : process.env.DATABASE_NAME,           // Name of database to connect to
    username             : process.env.DATABASE_USER,           // Username of database user
    password             : process.env.DATABASE_PASSWORD,       // Password of database user
});


app.use(express.json())                             // This is the bodyparser to allow the server to parse incoming JSON data
app.use(cors());


// Routes:
ingredientRoutes(app, sql);
recipeRoutes(app ,sql);




app.get('/recipes', async (request, response) => {

});



app.listen(3001, console.log('listening on port 3001'));

