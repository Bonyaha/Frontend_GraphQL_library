import { useState } from 'react'
import Select from 'react-select' // Import react-select
import { UPDATE_AUTHOR, ALL_AUTHORS, AUTHOR_ADDED } from '../queries'
import { useQuery, useMutation } from '@apollo/client'

const Authors = ({ setError, token }) => {
	const [selectedAuthor, setSelectedAuthor] = useState(null)
	const [birthYear, setBirthYear] = useState('')
	const result = useQuery(ALL_AUTHORS)
	const authors = result.data.allAuthors

	const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
		refetchQueries: [{ query: ALL_AUTHORS }],
		onError: (error) => {
			setError(error.graphQLErrors[0].message)
		}
	}
	)


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
			<h2>Authors</h2>
			<table>
				<tbody>
					<tr>
						<th></th>
						<th>
							<div >born</div>
						</th>
						<th>
							<div style={{ marginLeft: '5px' }}>books</div>
						</th>
					</tr>
					{authors.map((a) => (
						<tr key={a.name}>
							<td>{a.name}</td>
							<td>{a.born}</td>
							<td style={{ textAlign: 'right' }}>{a.bookCount}</td>
						</tr>
					))}
				</tbody>
			</table>
			{token &&
				<div>
					<form onSubmit={submit} className="form-container">
						<h3>Set BirthYear</h3>
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
			}
		</div>

	)
}

export default Authors