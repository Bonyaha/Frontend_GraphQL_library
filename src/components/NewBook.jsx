import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select' // Import react-select
import { ADD_BOOK, ALL_BOOKS } from '../queries'
import { useApolloClient } from '@apollo/client'
import { updateCache } from '../App'

const NewBook = ({ authors, token, setError }) => {
	const [title, setTitle] = useState('')
	const [author, setAuthor] = useState('')
	const [selectedAuthor, setSelectedAuthor] = useState(null)
	const [published, setPublished] = useState('')
	const [genre, setGenre] = useState('')
	const [genres, setGenres] = useState([])

	//for testing purposes, it shows the cache
	const client = useApolloClient()
	const cacheData = client.extract()
	console.log("cacheData:", cacheData)


	const [createBook] = useMutation(ADD_BOOK, {
		onError: (error) => {
			console.log(error)
			const messages = error.graphQLErrors[0]?.message
			setError(messages)
		},
		update: (cache, response) => {
			console.log(cache)
			updateCache(client.cache, {
				query: ALL_BOOKS,
				variables: { genre: '', author: '' },
			}, response.data.addBook)
		},

	}
	)

	const navigate = useNavigate()
	//console.log(selectedAuthor)
	const submit = async (event) => {
		event.preventDefault()

		createBook({
			variables: {
				title, published, genres,
				author: selectedAuthor ? selectedAuthor.value : author
			}
		})
		setTitle('')
		setPublished('')
		setAuthor('')
		setGenres([])
		setGenre('')
		navigate('/')
	}

	const addGenre = () => {
		setGenres(genres.concat(genre))
		setGenre('')
	}

	const authorOptions = authors.map(author => ({
		value: author.name,
		label: author.name
	}))


	return (
		<div>
			{token ?
				<form onSubmit={submit} className="form-container">
					<div className="form-group">
						<label>Title:</label>
						<input
							value={title}
							onChange={({ target }) => setTitle(target.value)}
						/>
					</div>
					<div className="form-group">
						<label>Select an existing author:</label>
						<Select
							options={authorOptions}
							value={selectedAuthor}
							onChange={selectedOption => setSelectedAuthor(selectedOption)}
							placeholder="Select an author"
							className="select-input"
						/>
						<label> or add new:</label>
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
				</form> :
				<p>Not logged in</p>
			}
		</div>
	)
}

export default NewBook