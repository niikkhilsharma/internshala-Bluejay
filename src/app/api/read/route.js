import * as XLSX from 'xlsx/xlsx.mjs'

import AWS from 'aws-sdk'

import { NextResponse } from 'next/server'

export async function GET(req) {
	const { searchParams } = new URL(req.url)
	const filter = searchParams.get('filter')
	const fileName = searchParams.get('fileName')

	const bucketName = `${process.env.AWS_S3_BUCKET_NAME}`

	// Configure AWS SDK
	AWS.config.update({
		accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
		region: `${process.env.AWS_S3_REGION}`, // Replace with your actual AWS S3 region
	})

	const s3 = new AWS.S3()
	const params = {
		Bucket: bucketName,
		Key: fileName,
	}

	const awsFile = await s3.getObject(params).promise()

	const workbook = XLSX.read(awsFile.Body, { cellDates: true })
	const sheetName = workbook.SheetNames[0]
	const sheet = workbook.Sheets[sheetName]
	const data = XLSX.utils.sheet_to_json(sheet)

	const wholeFormattedData = []

	data.map(row => {
		const formattedRow = { ...row }
		if (row['Pay Cycle Start Date'] !== '' && row['Pay Cycle End Date'] !== '') {
			const payStartDate = new Date(row['Pay Cycle Start Date'])
			const payEndDate = new Date(row['Pay Cycle End Date'])

			// Calculate the difference in milliseconds
			const differenceInMilliseconds = payEndDate - payStartDate

			// Convert milliseconds to days
			const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24)

			const consecutiveDays = Math.round(differenceInDays)
			formattedRow['consecutiveDaysWorked'] = consecutiveDays
		} else {
			formattedRow['consecutiveDaysWorked'] = 0
		}

		const timeString = row['Timecard Hours (as Time)'].toString()
		const [hours, minutes] = timeString.split(':').map(Number)
		const totalMinutes = hours * 60 + minutes

		if (totalMinutes < 600 && totalMinutes > 60) {
			formattedRow['lessThan10GreaterThan1'] = true
		} else {
			formattedRow['lessThan10GreaterThan1'] = false
		}

		if (totalMinutes >= 840) {
			formattedRow['workedMoreThanFourteen'] = true
		} else {
			formattedRow['workedMoreThanFourteen'] = false
		}
		wholeFormattedData.push(formattedRow)
	})

	const wholeFilteredData = []

	if (filter === null) {
		console.log('run')
		return NextResponse.json({ message: 'Please select a filter' }, { status: 400 })
	}

	wholeFormattedData.forEach(row => {
		if (filter === 'none') {
			wholeFilteredData.push(row)
		} else if (filter === 'sevenDays') {
			if (row['consecutiveDaysWorked'] >= 7) {
				wholeFilteredData.push(row)
			}
		} else if (filter === 'lessThan10GreaterThan1') {
			if (row['lessThan10GreaterThan1'] === true) {
				wholeFilteredData.push(row)
			}
		} else if (filter === 'moreThan14') {
			if (row['workedMoreThanFourteen'] === true) {
				wholeFilteredData.push(row)
			}
		}
	})

	return NextResponse.json({ wholeFilteredData })
}
