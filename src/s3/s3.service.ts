import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
	AWS_REGION = process.env.AWS_REGION;
	accessKeyId = process.env.AWS_ACCESS_KEY_ID;
	secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
	S3: AWS.S3;
	constructor() {
		this.S3 = new AWS.S3({
			region: process.env.AWS_REGION,
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		});
	}

	
	async uploadFile(file, bucket) {
		const { originalname } = file;

		await this.s3Upload(file.buffer, bucket, originalname, file.mimetype);
	}

	async s3Upload(file, bucket, name, mimetype) {
		const params = {
			Bucket: bucket,
			Key: String(name),
			Body: file,
			ContentType: mimetype,
			CreateBucketConfiguration: {
				LocationConstraint: this.AWS_REGION,
			},
		};

		try {
			const s3Response = await this.S3.upload(params).promise();
			return s3Response;
		} catch (e) {
			console.log(e);
		}
	}

	async s3GetObject(keyFile, bucket) {
		const params = {
			Key: keyFile,
			Bucket: bucket,
		};
		try {
			const s3Response = await this.S3.getObject(params).promise();
			return s3Response;
		} catch (error) {
			console.log(error);
		}
	}
}
