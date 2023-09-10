import { useQuery } from '@apollo/client'
import { USER, ALL_BOOKS } from '../queries'

const Recommendations = ({ token }) => {

	const result = useQuery(USER)

	const resultBooks = useQuery(ALL_BOOKS, {
		variables: { genre: result.data?.me.favoriteGenre },
		skip: !result.data // Skip the query if user data is not available
	})

	if (result.loading || resultBooks.loading) {
		return <div>loading...</div>
	}
	const favoriteGenre = result.data.me.favoriteGenre

	console.log(favoriteGenre)

	const books = resultBooks.data.allBooks
	return (
		<div>
			<h2>Recommendations</h2>
			{token ?
				<div>
					<p>books in your favourite genre: <strong>{favoriteGenre}</strong></p>
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

					} </div> :
				<p>Not logged in</p>
			}
		</div>
	)
}

export default Recommendations
