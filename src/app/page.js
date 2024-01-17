'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
	const [file, setFile] = useState(null)

	const handleSubmit = async e => {
		e.preventDefault()
		if (!file) return

		const formData = new FormData()
		formData.append('file', file)

		try {
			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData,
			})

			const data = await response.json()
			console.log(data.message)
		} catch (error) {
			console.log(error)
		}
	}

	const handleFileChange = e => {
		setFile(e.target.files[0])
	}

	return (
		<main className="w-full h-screen flex flex-col justify-center items-center">
			<form onSubmit={handleSubmit}>
				<input
					type="file"
					className="border border-black  m-4 p-4 rounded-xl"
					name="uploaded_file"
					onChange={handleFileChange}
				/>
				<Link href="/read">
					<button
						type="submit"
						className="bg-blue-500 p-5 rounded-xl text-white hover:bg-blue-600"
					>
						Submit
					</button>
				</Link>
			</form>
			<h3 className="text-xl text-center my-4 mt-8">
				Already Upload then please click below to read Data
			</h3>
			<div>
				<Link href="/read">
					<button className="bg-blue-500 p-5 px-20 rounded-xl hover:bg-blue-600 text-white">
						Read
					</button>
				</Link>
			</div>
		</main>
	)
}
