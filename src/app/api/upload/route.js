import { NextResponse } from 'next/server'
import * as fs from 'fs/promises'
import * as path from 'path'

export async function POST(request) {
	const formData = await request.formData()
	const file = formData.get('file')

	if (!file) {
		return NextResponse.json({ error: 'File is required.' }, { status: 400 })
	}

	console.log(file)

	const uploadDir = path.join(process.cwd(), 'public/uploads')
	await fs.mkdir(uploadDir, { recursive: true })

	const filePath = path.join(uploadDir, file.name)
	const fileBuffer = Buffer.from(await file.arrayBuffer())

	try {
		await fs.writeFile(filePath, fileBuffer)
		return NextResponse.json({ message: 'File uploaded.' }, { status: 200 })
	} catch (error) {
		console.error(error)
		return NextResponse.json({ error: 'Failed to upload the file.' }, { status: 500 })
	}
}
