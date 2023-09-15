import { useState } from 'react'
import { useQuery, useApolloClient } from '@apollo/client'
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'
import { ALL_AUTHORS, BOOK_ADDED, ALL_BOOKS } from './queries'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendatins'
import { useMutation, useSubscription } from '@apollo/client'

const Notify = ({ errorMessage }) => {
  if (!errorMessage) { return null }
  return (
    <div style={{ color: 'red' }}>
      {errorMessage}
    </div>
  )
}

// function that takes care of manipulating cache
export const updateCache = (cache, query, addedBook) => {  // helper that is used to eliminate saving same person twice
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
}

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const result = useQuery(ALL_AUTHORS)
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      notify(`${addedBook.title} added`)

      updateCache(client.cache, {
        query: ALL_BOOKS,
        variables: { genre: '', author: '' },
      }, addedBook)
    }
  })


  //console.log(result)
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
        <Notify errorMessage={errorMessage} />
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

        <Route path="/add" element={<NewBook authors={result.data.allAuthors} token={token} setError={notify} />} />
        <Route path="/" element={<Books authors={result.data.allAuthors} />} />
        <Route path="/authors" element={<Authors authors={result.data.allAuthors} setError={notify} token={token} />} />
        <Route path="/login" element={<LoginForm setToken={setToken}
          setError={notify} />} />
        <Route path="/recommend" element={<Recommendations token={token} />} />
      </Routes>
    </Router>


  )
}

export default App