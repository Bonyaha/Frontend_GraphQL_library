import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { useApolloClient } from '@apollo/client'

const Books = ({ authors }) => {
	const [selectedGenre, setSelectedGenre] = useState('')
	const [selectedAuthor, setSelectedAuthor] = useState('')
	const [allGenres, setAllGenres] = useState([])
	const [allAuthors, setAllAuthors] = useState([])


	const client = useApolloClient()
	/* const cacheData = client.extract()
	console.log(cacheData) */


	/* const result = useQuery(ALL_BOOKS, {
		variables: { genre: selectedGenre, author: selectedAuthor },
		onCompleted: (data) => {
			console.log('I am inside useQuery')
			console.log(data)
		}
	}) */
	const result = useQuery(ALL_BOOKS, {
		variables: { genre: selectedGenre, author: selectedAuthor },/*
		refetchQueries: () => ({
			query: ALL_BOOKS,
			variables: { genre: selectedGenre, author: selectedAuthor },
		}),
		onCompleted: (data) => {
			console.log('I am inside useQuery')
			console.log(data)
		}*/
	})
	/* we use Set to ensure we have a unique list of genres, and we use flatMap to flatten nested arrays of genres from each book into a single flat array of genres for all books. */
	useEffect(() => {
		if (result.data) {
			console.log('Test inside useEffect')
			const books = result.data.allBooks
			const genres = [...new Set(books.flatMap((book) => book.genres))]
			const allAuthors = [...new Set(authors.map((author) => author.name))]
			//console.log(allAuthors)
			setAllGenres(genres)
			setAllAuthors(allAuthors)
		}
	}, [])

	console.log("Test after useEffect")
	if (result.loading) {
		return <div>loading...</div>
	}
	//console.log(result.data.allBooks)
	const books = result.data.allBooks

	const handleGenreClick = (genre) => {
		setSelectedGenre(genre)
		result.refetch({ genre, author: selectedAuthor })
	}
	const handleShowAllGenres = () => {
		setSelectedGenre('')
	}
	const handleAuthorClick = (author) => {
		setSelectedAuthor(author)
	}
	const handleShowAllAuthors = () => {
		setSelectedAuthor('')
	}

	return (
		<div>

			<h2>books</h2>
			<p>in genre: <strong>{selectedGenre}</strong> </p>
			<p>by author: <strong>{selectedAuthor}</strong></p>
			{books.length > 0 ?
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
				: <p>No books by your criteria were found</p>


			}

			<div>
				{allGenres.map((genre) => (
					<button
						key={genre}
						onClick={() => handleGenreClick(genre)}
						className={selectedGenre === genre ? 'selected' : ''}>
						{genre}
					</button>

				))}
				<button onClick={handleShowAllGenres}>Show All</button>
			</div>
			<div>
				{allAuthors.map((author) => (
					<button
						key={author}
						onClick={() => handleAuthorClick(author)}
						className={selectedAuthor === author ? 'selected' : ''}>
						{author}
					</button>
				))}
				<button onClick={handleShowAllAuthors}>Show All</button>
			</div>
		</div>
	)
}

export default Books
