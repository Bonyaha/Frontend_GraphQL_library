import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = () => {
	const [selectedGenre, setSelectedGenre] = useState('')
	const [allGenres, setAllGenres] = useState([])

	const result = useQuery(ALL_BOOKS, {
		variables: { genre: selectedGenre },
	})

	useEffect(() => {
		if (result.data) {
			const books = result.data.allBooks
			const genres = [...new Set(books.flatMap((book) => book.genres))]
			setAllGenres(genres)
		}
	}, [])

	if (result.loading) {
		return <div>loading...</div>
	}
	//console.log(result)
	const books = result.data.allBooks
	/* we use Set to ensure we have a unique list of genres, and we use flatMap to flatten nested arrays of genres from each book into a single flat array of genres for all books. */
	const genres = [...new Set(books.flatMap((book) => book.genres))]


	const handleGenreClick = (genre) => {
		setSelectedGenre(genre)
	}
	const handleShowAll = () => {
		setSelectedGenre('')
	}

	console.log(selectedGenre)
	console.log(allGenres)
	return (
		<div>
			<h2>books</h2>
			<p>in genre: <strong>{selectedGenre}</strong> </p>
			<table>
				<tbody>
					<tr>
						<th></th>
						<th>author</th>
						<th>published</th>
					</tr>
					{books.map((book) => (
						<tr key={book.title}>
							<td>{book.title}</td>
							<td>{book.author.name}</td>
							<td>{book.published}</td>
						</tr>
					))}
				</tbody>
			</table>
			<div>
				{allGenres.map((genre) => (
					<button key={genre} onClick={() => handleGenreClick(genre)}>
						{genre}
					</button>

				))}
				<button onClick={handleShowAll}>Show All</button>
			</div>
		</div>
	)
}

export default Books
