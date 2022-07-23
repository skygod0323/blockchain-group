import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const S3_BUCKET ='blockchain-module-images';
const REGION ='us-east-2';
const ACCESS_KEY ='AKIA36SOUH2TMEJHF3QL';
const SECRET_ACCESS_KEY ='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';

const config = {
    bucketName: S3_BUCKET,
    region: REGION,
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
}

AWS.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
});

const awsUpload = (params) => {
    const bucket = new AWS.S3({
        params: { Bucket: S3_BUCKET },
        region: REGION,
    });
    return new Promise((resolve, reject) => {
        bucket.putObject(params).send((err) => {
            if (err) {
                console.log('s3 put object error: ', err);
                reject(err);
            } else {
                resolve(`https://blockchain-module-images.s3.us-east-2.amazonaws.com/${params.Key}`);
            }
        })
    })
}


const uploadFileToS3 = async (file) => {
    const params = {
        ACL: 'public-read',
        Body: file,
        Bucket: S3_BUCKET,
        Key: uuidv4() + '_' + file.name,
        ContentType: 'image/jpeg',
    };
    return await awsUpload(params);
};

export { uploadFileToS3 }