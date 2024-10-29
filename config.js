import dotenv from "dotenv";
dotenv.config();

if (!process.env.GOOGLE_CLOUD_CREDENTIALS) {
    throw new Error("Please provide credentials to GCS");
}

if (!process.env.BUCKET_NAME) {
    throw new Error("Please provide GCS Bucket name");
}

if (!process.env.PROJECT_ID) {
    throw new Error("Please provide GCS Project ID");
}

if (!process.env.DATABASE_NAME) {
    throw new Error("Please provide database name");
}

if (!process.env.DATABASE_USER) {
    throw new Error("Please provide database user");
}

if (!process.env.DATABASE_PASSWORD) {
    throw new Error("Please provide database password");
}

export const DATABASE_NAME = process.env.DATABASE_NAME;
export const DATABASE_USER = process.env.DATABASE_USER;
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;

export const GCS_CREDENTIALS = process.env.GOOGLE_CLOUD_CREDENTIALS;
export const BUCKET_NAME = process.env.BUCKET_NAME;
export const PROJECT_ID = process.env.PROJECT_ID;
