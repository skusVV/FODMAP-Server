import {Storage} from '@google-cloud/storage';
import dotenv from 'dotenv';
dotenv.config();


const cloudStorage = new Storage({
    credentials: JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS),
    projectId: process.env.PROJECT_ID
});

const bucket = cloudStorage.bucket(process.env.BUCKET_NAME);

export function uploadImage(imageData) {
    console.log("Image upload triggered");

    const imageBuffer = imageData.buffer;
    const file_name = imageData.originalname;
    const file_type = imageData.mimetype;
    const file = bucket.file(file_name);
    const options = {
        resumable: false,
        metadata: {
            contentType: file_type,
        }
    };

    return new Promise((resolve, reject) => {
        file.save(imageBuffer, options, function (err) {
            if (!err) {
                console.log(`File: ${file_name} has been uploaded to bucket`);
                resolve();
            } else {
                console.log('Error uploading image to bucket');
                reject(err);
            };
        });

    });
};

