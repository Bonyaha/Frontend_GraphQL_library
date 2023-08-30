import { useQuery } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'
import { ALL_AUTHORS } from './queries'


const App = () => {
  const result = useQuery(ALL_AUTHORS)

  //console.log(result)
  const padding = {
    padding: 5
  }
  if (result.loading) {
    return <div>loading...</div>
  }

  return (
    <Router>
      <div>
        <Link style={padding} to="/">authors</Link>
        <Link style={padding} to="/books">books</Link>
        <Link style={padding} to="/add">add book</Link>
      </div>

      <Routes>
        <Route path="/add" element={<NewBook authors={result.data.allAuthors} />} />
        <Route path="/books" element={<Books />} />
        <Route path="/" element={<Authors authors={result.data.allAuthors} />} />
      </Routes>
    </Router>


  )
}

export default App