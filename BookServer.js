async function fetchBooks() {
    try {
        const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=javascript&maxResults=10');
        const data = await response.json();
        return data.items;

    } catch (error) {
        console.error('Error fetching books:', error);
        return [];
    }
}

async function processBooks(books) {
    try {
        if (!Array.isArray(books)) {
            throw new Error('Books must be an array');
        }
        let processedBooks = [...books];
         processedBooks.sort((a, b) => new Date(a.volumeInfo.publishedDate) - new Date(b.volumeInfo.publishedDate));
        return processedBooks;
    } catch (error) {
        console.error('Error processing books:', error);
        return [];
    }
}

async function filterBooks(books, filterType, filterValue) {
    try {
        let filteredBooks = [...books];
        switch (filterType) {
            case 'category':
                filteredBooks = filteredBooks.filter(book =>
                    book.volumeInfo.categories && book.volumeInfo.categories.includes(filterValue)
                );
                break;
            case 'search':
                filteredBooks = filteredBooks.filter(book =>
                    book.volumeInfo.title.toLowerCase().includes(filterValue.toLowerCase())
                    || (book.volumeInfo.authors && book.volumeInfo.authors.some(author => author.toLowerCase().includes(filterValue.toLowerCase())))
                );
                break;
            default:
                break;
        }
        return filteredBooks;
    } catch (error) {
        console.error('Error filtering books:', error);
        return [];
    }
}


async function fetchAndProcessBooks() {
    try {
        // Fetch books asynchronously
        const data = await fetchBooks();

        const sortedBooks = await processBooks(data);

        const searchFiltered = await filterBooks(sortedBooks, 'search', 'David Flanagan');
        console.log('Search by author Filtered Books :', searchFiltered);
    } catch (error) {
        console.error('Error fetching, processing, or filtering books:', error);
    }
}

// Call the combined function to fetch, process, and filter books
fetchAndProcessBooks();



