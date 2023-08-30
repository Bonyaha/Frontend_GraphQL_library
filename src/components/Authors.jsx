import { useState } from 'react'
import { useMutation } from '@apollo/client'
import Select from 'react-select' // Import react-select
import { UPDATE_AUTHOR, ALL_AUTHORS } from '../queries'


const Authors = ({ authors }) => {
	const [selectedAuthor, setSelectedAuthor] = useState(null) // State for selected author
	console.log(selectedAuthor)
	const [birthYear, setBirthYear] = useState('')

	const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
		refetchQueries: [{ query: ALL_AUTHORS }]
	}
	)

	const margin = {
		margin: 5
	}

	const submit = async (event) => {
		event.preventDefault()

		console.log('update author...')
		updateAuthor({ variables: { name: selectedAuthor.value, setBornTo: birthYear } })
		setSelectedAuthor(null)
		setBirthYear('')
	}
	// Transform authors array for react-select options
	const authorOptions = authors.map(author => ({
		value: author.name,
		label: author.name
	}))

	return (
		<div>
			<h2>authors</h2>
			<table>
				<tbody>
					<tr>
						<th></th>
						<th>born</th>
						<th>books</th>
					</tr>
					{authors.map((a) => (
						<tr key={a.name}>
							<td>{a.name}</td>
							<td>{a.born}</td>
							<td>{a.bookCount}</td>
						</tr>
					))}
				</tbody>
			</table>
			<div>
				<form onSubmit={submit} className="form-container">
					<h2>Set BirthYear</h2>
					<div className="form-group">
						<label>Select an author:</label>
						<Select
							options={authorOptions}
							value={selectedAuthor}
							onChange={selectedOption => setSelectedAuthor(selectedOption)}
							placeholder="Select an author"
							className="select-input"
						/>
					</div>
					<div className="form-group">
						<label htmlFor="birthYear">Born:</label>
						<input
							type="number"
							id="birthYear"
							value={birthYear}
							onChange={({ target }) => setBirthYear(Number(target.value))}
							className="birth-input"
						/>
					</div>
					<button type="submit" className="submit-button">Update Author</button>
				</form>
			</div>

		</div>
	)
}

export default Authors