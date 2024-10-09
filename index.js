const express = require('express');
const cors = require('cors');
const postgres = require("postgres");
const multer = require('multer')


require('dotenv').config;


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


ingredientRoutes(app, sql);
recipeRoutes(app ,sql);

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


app.post('/api/upload_image', upload.single('recipe_image'), async (req, res) => {
    console.log("Image API enpoint triggered");
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);
    res.status(201).json();
})


app.get('/recipes', async (request, response) => {
    // const recipes = await Recipes.find({  });

    // response.send(recipes);


    // const recipeBlocks = await RecipesBlock.find({ });
    // const recipes = recipeBlocks.map(item => {
    //     const recipes = Recipes.find({id: {$in: item.recipes}})
    // })


    // response.send(recipes)
});



app.listen(3001, console.log('listening on port 3001'));


// FIREBASE
// TRANSACTIONAL SQL - INSERT DONE

// READ DATABASE MIGRATION


// Steps1 : Add recipoes to db
// Step 2 : 




/* 
{
  name: 'Chilli con carne',
  image: 'www.chillirecipe.com',
  time: 120,
  servings: 5,
  meal_type: 'main',
  diet: [ 'high_fodmap' ],
  ingredients: [
    {
      ingredient_id: 392,
      ingredient_name: 'Beef',
      ingredient_detail: 'Ground',
      ingredient_category: 'Meat',
      amount: '500',
      unit: 'g'
    },
    {
      ingredient_id: 444,
      ingredient_name: 'Tomato',
      ingredient_detail: null,
      ingredient_category: 'Nightshade Vegetable',
      amount: '800',
      unit: 'ml'
    },
    {
      ingredient_id: 353,
      ingredient_name: 'Bean',
      ingredient_detail: 'Kidney',
      ingredient_category: 'Legume',
      amount: '800',
      unit: 'g'
    }
  ],
  steps: { '1': 'Cook the beef', '2': 'Add the tomato', '3': 'Add the beans' }
}
*/