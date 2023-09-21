I had an issue with filtering initially, when I didn't use refetch method of useQuery. Here is what it was👇:

Here is the flow of actions:
When I first log in in the app, it shows me Book component, because it's home view.
Then I go to add book view (NewBook component) and add new book (genre - "agile").
After that it take me to the Books view (navigate('/') is calling).
I see that newly added book is there, the list of books is updated.
After that, I press a button "agile" for filtering books on this genre.
Again, everything is ok, I see the old book  and the new one with that genre. So now there are 2 books with genre "agile".
Then I go again to add book view and add another book with genre "agile".
After that I'm taken back to Books component and again I can see the new added book at the list of all books.
But after that when I again press a button "agile" for filtering books on this genre, the new book is not there! There are only old 2 books without new book!

Here is my theory: When we press filtering button for the first time, it queries the cache for the ALL_BOOKS with that selected genre with the help of variables: { genre: selectedGenre, author: selectedAuthor }. But when we filter again next time, it sees that we are interesting in that "agile" genre, as we did before, and it DOESN'T do query at this time and just gives us the old, "remembered" books on that genre (despite the fact that cache was updated). 
Can that be true?  Can it be that Apollo remember my query with genre"agile" and gives me the old data?

ChatGPT didn't give me reasonable answer.

As for the question about "Why result.refetch is working, and refetchQueries in useQuery - don't", here is the answer of ChatGPT:

		result.refetch is used to directly refetch the ALL_BOOKS query with the currently selected genre and author variables when you click on the "agile" button. This ensures that the query is executed with the latest variables and fetches the correct data.

		refetchQueries in useQuery is typically used when you have a mutation that affects multiple queries, and you want to specify which queries should be refetched after the mutation. It's not used to trigger a refetch of the current query defined by useQuery
So, here in my situation, refetchQueries in useQuery is useless for filtering purposes
Also, I noticed, that sometimes when filtering on different genres and authors occurs, it shows only filtered books despite that I press Show all button - it change the show all list to previously selected button even so I didn't press it again. It's strange. But it happens seldom. This happens with refetch method.

It's important to use in NewBook component the same structure for updateQuery as in Books component in useQuery: if we use in useQuery variables: { genre: selectedGenre, author: selectedAuthor }, then we must use variables: { genre: '', author: '' } in updateQuery in NewBook component. 


I added addedAuthor parameter in updateCache function because we need to update ALL_AUTHORS query if we want to see updated number of books in Author view.