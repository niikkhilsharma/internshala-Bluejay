'use client'
import { useState, useEffect } from 'react'

export default function Page() {
	const [filter, setFilter] = useState('none')
	const [data, setData] = useState(null)
	const [loading, setLoading] = useState(true)

	const keysToShow = ['Employee Name', 'Position Status']

	useEffect(() => {
		const getDate = async () => {
			setLoading(true)
			const data = await fetch(`/api/read?filter=${filter}`).then(res => res.json())
			setData(data.wholeFilteredData)
			console.log(data.wholeFilteredData)
			setLoading(false)
		}
		getDate()
	}, [filter])

	return (
		<div className="container mx-auto">
			<div className="my-10">
				<div className="text-center w-full text-xl font-semibold underline">
					Categorize Employees with the help of these filters
				</div>
				<div className="my-10 flex justify-evenly items-center">
					<span
						className={`inline-flex items-center rounded-md ${
							filter === 'sevenDays'
								? 'bg-yellow-600 text-white shadow-xl'
								: 'bg-indigo-50 hover:bg-indigo-100'
						} px-4 py-2 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 hover:cursor-pointer`}
						onClick={() => setFilter('sevenDays')}
					>
						Has worked for 7 consecutive days.
					</span>
					<span
						className={`inline-flex items-center rounded-md ${
							filter === 'lessThan10GreaterThan1'
								? 'bg-yellow-600 text-white shadow-xl'
								: 'bg-indigo-50 hover:bg-indigo-100'
						} px-4 py-2 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 hover:cursor-pointer `}
						onClick={() => setFilter('lessThan10GreaterThan1')}
					>
						have less than 10 hours of time between shifts but greater than 1 hour
					</span>
					<span
						className={`inline-flex items-center rounded-md ${
							filter === 'moreThan14'
								? 'bg-yellow-600 text-white shadow-xl'
								: 'bg-indigo-50 hover:bg-indigo-100'
						} px-4 py-2 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 hover:cursor-pointer `}
						onClick={() => setFilter('moreThan14')}
					>
						has worked for more than 14 hours in a single shift
					</span>
					<span
						className={`inline-flex items-center rounded-md ${
							filter === 'none' ? 'bg-yellow-600 text-white shadow-xl' : 'bg-indigo-50'
						} px-4 py-2 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 hover:cursor-pointer hover:bg-indigo-100`}
						onClick={() => setFilter('none')}
					>
						Clear Filters
					</span>
				</div>
			</div>
			{loading ? (
				<div className="text-center text-xl font-semibold">Loading Data...</div>
			) : (
				<div>
					<table className="table-auto w-full text-center">
						<thead>
							<tr>
								<th className="px-4 py-2 border">
									<span className="text-xl font-semibold">S.No</span>
								</th>
								{Object.keys(data[0])
									.filter(key => keysToShow.includes(key))
									.map((item, index) => (
										<th className="px-4 py-2 border" key={index}>
											{item}
										</th>
									))}
							</tr>
						</thead>
						<tbody>
							{data.map((item, index) => (
								<tr key={index}>
									<td className="border px-4 py-2">{index + 1}</td>
									{Object.keys(item)
										.filter(key => keysToShow.includes(key))
										.map((key, index) => (
											<td className="border px-4 py-2" key={index}>
												{item[key].toString()}
											</td>
										))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	)
}
