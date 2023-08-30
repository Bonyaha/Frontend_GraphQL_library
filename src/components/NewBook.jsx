import { useState } from 'react'
import { useMutation } from '@apollo/client'
import Select from 'react-select'
import { ADD_BOOK, ALL_BOOKS } from '../queries'

const NewBook = (props) => {
	const [title, setTitle] = useState('')
	const [author, setAuthor] = useState('')
	const [published, setPublished] = useState('')
	const [genre, setGenre] = useState('')
	const [genres, setGenres] = useState([])

	const [createBook] = useMutation(ADD_BOOK, {
		refetchQueries: [{ query: ALL_BOOKS }]
	}
	)

	const submit = async (event) => {
		event.preventDefault()

		console.log('add book...')
		createBook({ variables: { title, author, published, genres } })
		setTitle('')
		setPublished('')
		setAuthor('')
		setGenres([])
		setGenre('')
	}

	const addGenre = () => {
		setGenres(genres.concat(genre))
		setGenre('')
	}

	return (
		<div>
			<form onSubmit={submit} className="form-container">
				<div className="form-group">
					<label>Title:</label>
					<input
						value={title}
						onChange={({ target }) => setTitle(target.value)}
					/>
				</div>
				<div className="form-group">
					<label>Author:</label>
					<input
						value={author}
						onChange={({ target }) => setAuthor(target.value)}
					/>
				</div>
				<div className="form-group">
					<label>Published:</label>
					<input
						type="number"
						value={published}
						onChange={({ target }) => setPublished(Number(target.value))}
					/>
				</div>
				<div>
					<input
						value={genre}
						onChange={({ target }) => setGenre(target.value)}
					/>
					<button onClick={addGenre} type="button" className="genre-button">
						add genre
					</button>
				</div>
				<div>genres: {genres.join(' ')}</div>
				<button type="submit" className="submit-button">create book</button>
			</form>
		</div>
	)
}

export default NewBook





