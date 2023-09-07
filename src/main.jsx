import React from 'react'
import ReactDOM from 'react-dom/client'
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import App from './App.jsx'
import './style.css'

/* authLink is a function that creates an Apollo Link responsible for modifying request headers to add an authorization token, making it act like a middleware for authentication. */
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('library-user-token')
  return {
    headers: {
      ...headers, authorization: token ? `Bearer ${token}` : null,
    }
  }
})

const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
})
/* When you use authLink.concat(httpLink), you are creating a chain of Apollo Links. This means that when a GraphQL request is made, it first passes through authLink, which modifies the request headers to include authentication information if necessary. Then, the request is passed to httpLink, which handles the actual HTTP communication with your GraphQL server. */
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)