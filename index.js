import express from 'express';
import cors from 'cors';
import postgres from 'postgres';
import multer from 'multer';
import {Storage} from '@google-cloud/storage';


import dotenv from 'dotenv';
dotenv.config();


// Routes
import { ingredientRoutes } from './routes/ingredient.route.js';
import { recipeRoutes } from './routes/recipe.route.js';


const cloudStorage = new Storage({
    credentials: JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS),
    projectId: process.env.PROJECT_ID
});

const bucket = cloudStorage.bucket(process.env.BUCKET_NAME);

const sql = postgres({
    host                 : 'localhost',                         // Postgres ip address[s] or domain name[s]
    port                 : 5432,                                // Postgres server port[s]
    database             : process.env.DATABASE_NAME,           // Name of database to connect to
    username             : process.env.DATABASE_USER,           // Username of database user
    password             : process.env.DATABASE_PASSWORD,       // Password of database user
});

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const app = express();

app.use(express.json())                             // This is the bodyparser to allow the server to parse incoming JSON data
app.use(express.urlencoded({ extended: true}))      // This is the bodyparser to allow the server to parse incoming x-www-form-urlencoded data
app.use(cors());


// Routes:
ingredientRoutes(app, sql);
recipeRoutes(app ,sql, upload, bucket);


app.listen(3001, console.log('listening on port 3001'));
