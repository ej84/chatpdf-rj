// This file is meant to work with the s3 server to download pdf file.
import AWS from 'aws-sdk';
import fs from 'fs'; // import file system.

export async function  downloadFromS3(file_key: string) {
    try {
        // Configuration for AWS
        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
            secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
        });
        const s3 = new AWS.S3({
            params: {
                Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
            },
            region: 'us-east-2'
        });
        const params = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
            Key: file_key,
        };
        // Get and save the file in the local folder.
        const obj = await s3.getObject(params).promise();
        const file_name = `C:/Users/Richard_Jeong/AppData/Local/Temp/pdf-${Date.now()}.pdf`;
        fs.writeFileSync(file_name, obj.Body as Buffer);
        return file_name;
    } catch(error) {
        console.error(error);
        return null;
    }
}