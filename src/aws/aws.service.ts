import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AwsService {
    constructor() {}

    async fileUpload(file: any) {
        const s3 = new S3();

        const param = {
            Body: file.buffer,
            Key: file.originalname,
            ACL: 'public-read',
            Bucket: process.env.S3_BUCKET,
            ContentType: 'image/jpeg'
        }

        return await s3.upload(param).promise()
                                    .then((data) => {
                                        return data.Location
                                    })
                                    .catch((error) => {
                                        console.error(error)
                                    })
    }
}
