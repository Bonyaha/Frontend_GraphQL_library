import { useState } from 'react'
import { useQuery, useApolloClient } from '@apollo/client'
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'
import { ALL_AUTHORS, BOOK_ADDED, ALL_BOOKS, AUTHOR_ADDED } from './queries'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendatins'
import { useSubscription } from '@apollo/client'

const Notify = ({ bookAddedNotification, authorAddedNotification }) => {
  return (
    <div>
      {bookAddedNotification && (
        <div style={{ color: 'green' }}>{bookAddedNotification}</div>
      )}
      {authorAddedNotification && (
        <div style={{ color: 'blue' }}>{authorAddedNotification}</div>
      )}
    </div>
  )
}

const ErrorNotification = ({ errorMessage }) => {
  if (!errorMessage) { return null }
  return (
    <div style={{ color: 'red' }}>
      {errorMessage}
    </div>
  )
}

// function that takes care of manipulating cache
export const updateCache = (cache, query, addedBook, addedAuthor) => {
  // helper that is used to eliminate saving same book twice
  const uniqByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }
  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    }
  })
  // Update ALL_AUTHORS query if an author is added or if new book is added
  if (addedAuthor) {
    cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
      // Find the index of the author in the list
      const authorIndex = allAuthors.findIndex(
        (author) => author.name === addedAuthor.name)

      // Update the author's bookCount
      const updatedAuthor = {
        ...allAuthors[authorIndex],
        bookCount: allAuthors[authorIndex].bookCount + 1,
      }
      // Create a new array with the updated author
      const updatedAuthors = [...allAuthors]
      updatedAuthors[authorIndex] = updatedAuthor

      return { allAuthors: updatedAuthors }
    })
  }
}

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const [bookAddedNotification, setBookAddedNotification] = useState(null)
  const [authorAddedNotification, setAuthorAddedNotification] = useState(null)


  const result = useQuery(ALL_AUTHORS)
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      const addedAuthor = data.data.bookAdded.author
      setBookAddedNotification(`${addedBook.title} added`)
      setTimeout(() => {
        setBookAddedNotification(null)
      }, 5000)
      updateCache(client.cache, {
        query: ALL_BOOKS,
        variables: { genre: '', author: '' },
      }, addedBook, addedAuthor)
    }
  })

  useSubscription(AUTHOR_ADDED, {
    onData: ({ data }) => {
      const addedAuthor = data.data.authorAdded
      setAuthorAddedNotification(`${addedAuthor.name} added`)
      setTimeout(() => {
        setAuthorAddedNotification(null)
      }, 5000)
      client.cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
        return { allAuthors: allAuthors.concat(addedAuthor), }
      })
    }
  })


  const padding = {
    padding: 5
  }
  if (result.loading) {
    return <div>loading...</div>
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  return (
    <Router>
      <div>
        <Notify
          bookAddedNotification={bookAddedNotification}
          authorAddedNotification={authorAddedNotification}
        />

        <ErrorNotification errorMessage={errorMessage} />
        <Link className="button-link" style={padding} to="/">books</Link>
        <Link className="button-link" style={padding} to="/authors">authors</Link>
        <Link className="button-link" style={padding} to="/recommend">recommend</Link>
        {token ? (
          <>
            <Link className="button-link" style={padding} to="/add">add book</Link>
            <button className="button-logout" onClick={() => setToken(null)}>logout</button>
          </>
        ) : (
          <Link className="button-link" style={padding} to="/login">login</Link>
        )}
      </div>

      <Routes>
        <Route path="/" element={<Books authors={result.data.allAuthors} />} />
        <Route path="/add" element={<NewBook authors={result.data.allAuthors} token={token} setError={notify} />} />
        <Route path="/authors" element={<Authors setError={notify} token={token} />} />
        <Route path="/login" element={<LoginForm setToken={setToken}
          setError={notify} />} />
        <Route path="/recommend" element={<Recommendations token={token} />} />
      </Routes>
    </Router>


  )
}

export default App