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


    async checkImageExists(file_name, res) {
        console.log("Checking image names...");
        const file = this.bucket.file(file_name);

        try {
            const data = await file.exists()
            const exists = data[0];

            if (exists) {
                console.log(`File: '${file_name}' already exists. Image upload aborted.`);
                res.status(409).send({error_message: `File: '${file_name}' already exists. Please rename image file and try again.`})
                return true
            } else {
                console.log(`Upload permitted. File: '${file_name}' does not exist. `);
                return false
            };

        } catch (error) {
            console.error('Error checking file existence', error);
            res.status(500).send({ error_message: 'Error checking file existence. Image not uploaded.' });
            return true;
        };
         
    };

}
