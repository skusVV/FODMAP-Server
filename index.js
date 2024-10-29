import express from "express";
import cors from "cors";
import postgres from "postgres";
import multer from "multer";
import { Storage } from "@google-cloud/storage";
import {
    BUCKET_NAME,
    DATABASE_NAME,
    DATABASE_PASSWORD,
    DATABASE_USER,
    GCS_CREDENTIALS,
    PROJECT_ID,
} from "./config.js";

// Routes
import { ingredientRoutes } from "./routes/ingredient.route.js";
import { recipeRoutes } from "./routes/recipe.route.js";

const cloudStorage = new Storage({
    credentials: JSON.parse(GCS_CREDENTIALS),
    projectId: PROJECT_ID,
});

const bucket = cloudStorage.bucket(BUCKET_NAME);

const sql = postgres({
    host: "localhost", // Postgres ip address[s] or domain name[s]
    port: 5432, // Postgres server port[s]
    database: DATABASE_NAME, // Name of database to connect to
    username: DATABASE_USER, // Username of database user
    password: DATABASE_PASSWORD, // Password of database user
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();

app.use(express.json()); // This is the bodyparser to allow the server to parse incoming JSON data
app.use(express.urlencoded({ extended: true })); // This is the bodyparser to allow the server to parse incoming x-www-form-urlencoded data
app.use(cors());

// Routes:
ingredientRoutes(app, sql);
recipeRoutes(app, sql, upload, bucket);

app.listen(3001, console.log("listening on port 3001"));
