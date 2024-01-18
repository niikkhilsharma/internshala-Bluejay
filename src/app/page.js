'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
	const [file, setFile] = useState(null)
	const router = useRouter()
	const [uploading, setUploading] = useState(false)

	const handleSubmit = async e => {
		e.preventDefault()
		if (!file) return
		setUploading(true)
		const formData = new FormData()
		formData.append('file', file)

		try {
			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData,
			})

			const data = await response.json()
			console.log(data.message)
			router.push(`/read?fileName=${data.fileName}`)
		} catch (error) {
			setUploading(false)
			alert('Error uploading file')
			console.log(error)
		}
	}

	const handleFileChange = e => {
		setFile(e.target.files[0])
	}

	if (uploading) {
		return (
			<div className="min-h-screen w-full flex flex-col justify-center items-center">
				<div
					className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
					role="status"
				></div>
				<span className="my-4 animate-ping">Uploading File</span>
			</div>
		)
	}

	if (!uploading) {
		return (
			<main className="w-full h-screen flex flex-col justify-center items-center">
				<h1 className="text-center text-xl font-semibold">Please Upload your file here</h1>
				<form onSubmit={handleSubmit}>
					<input
						type="file"
						className="border border-black  m-4 p-4 rounded-xl"
						name="uploaded_file"
						onChange={handleFileChange}
					/>
					<button
						type="submit"
						className="bg-blue-500 p-5 rounded-xl text-white hover:bg-blue-600"
					>
						Submit
					</button>
				</form>
				<div className="flex flex-col justify-center items-center mt-20">
					<h3 className="text-xl font-semibold">
						Don&apos;t want to upload file then click here to test the output from the
						previously uploaded file.
					</h3>
					<Link
						href="/read?fileName=Assignment_Timecard.xlsx"
						className="bg-blue-500 text-white p-4 rounded-md hover:bg-blue-700 mt-4"
					>
						Click Here
					</Link>
				</div>
			</main>
		)
	}
}
