export default class ImageService {
    constructor(bucket) {
        this.bucket = bucket;
    }

    uploadImage(imageData) {
        console.log("Image upload triggered");

        const imageBuffer = imageData.buffer;
        const file_name = imageData.originalname;
        const file_type = imageData.mimetype;
        const file = this.bucket.file(file_name);
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

    }

}
