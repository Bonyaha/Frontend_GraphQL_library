import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
    name
    born
    bookCount
    }
  }
`
export const ALL_BOOKS = gql`
query ($genre: String,$author: String) {
  allBooks(genre: $genre,author: $author) {
    title
    author {
      name
      id
      born
      bookCount
    }
    published
    id
    genres
  }
}
`
export const ADD_BOOK = gql`
mutation createBook($title: String!, $published: Int!, $author: String!, $genres: [String!]!) {
  addBook(title: $title, published: $published, author: $author, genres: $genres) {    
    title  
    author {
      name
      books {
        title
        published
        id
        genres
      }
      id
      born
      bookCount
    }
    published 
    id 
    genres  
  }
}
`

export const UPDATE_AUTHOR = gql`
mutation updateAuthor($name: String!, $setBornTo: Int!) {
  editAuthor(name: $name, setBornTo: $setBornTo) { 
   name   
  }
}
`
export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const USER = gql`
  query Query {
  me {
    username
    favoriteGenre
    id
  }
}
`
export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      
    title
    author {
      name
      books {
        title
        published
        id
        genres
      }
      id
      born
      bookCount
    }
    published
    id
    genres
  }
    
  }
 
`