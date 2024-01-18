import { NextResponse } from 'next/server'

import { PutObjectCommand } from '@aws-sdk/client-s3'
import { s3Client } from '@/utils'

async function uploadFileToS3(file, fileName) {
	const fileBuffer = file
	console.log(fileName)

	const params = {
		Bucket: process.env.AWS_S3_BUCKET_NAME,
		Key: `${fileName}`,
		Body: fileBuffer,
		ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	}

	const command = new PutObjectCommand(params)
	await s3Client.send(command)
	return fileName
}

export async function POST(request) {
	try {
		const formData = await request.formData()
		const file = formData.get('file')
		console.log('running')

		if (!file) {
			return NextResponse.json({ error: 'File is required.' }, { status: 400 })
		}

		console.log(file)

		const buffer = Buffer.from(await file.arrayBuffer())
		const fileName = await uploadFileToS3(buffer, file.name)

		return NextResponse.json({ message: 'File uploaded.', fileName }, { status: 200 })
	} catch (error) {
		console.error(error)
		return NextResponse.json({ error: 'Failed to upload the file.' }, { status: 500 })
	}
}
