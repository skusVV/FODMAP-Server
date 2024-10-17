import express from 'express';
import cors from 'cors';
import postgres from 'postgres';
import multer from 'multer';


import dotenv from 'dotenv';
dotenv.config();


// Routes
import { ingredientRoutes } from './routes/ingredient.route.js';
import { recipeRoutes } from './routes/recipe.route.js';






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


const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// Routes:
ingredientRoutes(app, sql);
recipeRoutes(app ,sql, upload);



app.get('/api/download_image', async (req, res) => {
    console.log('download_image api hit');

    
    // The ID of your GCS bucket
    const bucketName = process.env.BUCKET_NAME;

    // The ID of your GCS file
    const srcFileName = 'sausage-ragu.jpg';

    // The path to which the file should be downloaded
    const destFileName = './downloads/' + srcFileName;

    async function downloadFile() {
        const options = {
        destination: destFileName,
        };

        // Downloads the file
        await bucket.file(srcFileName).download(options);

        console.log(
        `gs://${bucketName}/${srcFileName} downloaded to ${destFileName}.`
        );
    }

    downloadFile().catch(console.error);
})


app.get('/recipes', async (request, response) => {

});



app.listen(3001, console.log('listening on port 3001'));




// Next lesson:
// 1. Import services (image.services and recipe.services (EJS vs CJS error))
// 2. Clear errors on console when uploading recipe infor key error
// 3. Date/time created time is showing data as well