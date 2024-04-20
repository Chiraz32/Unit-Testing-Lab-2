import { expect, describe, it } from "vitest";
import { fetchBooks, filterBooks, processBooks } from "./BookServer.js";
describe("fetchBooks()", () => {
  it("should fetch data of a Volume", async () => {
    try {
      const books = await fetchBooks();
      expect(books.length).toBe(10); // Assuming maxResults is set to 10 in the API call
      expect(books[0]).toHaveProperty("id");
      expect(books[0]).toHaveProperty("volumeInfo");
      expect(books[0]).toHaveProperty("saleInfo");
      expect(books[0].volumeInfo).toHaveProperty("title");
      expect(books[0].volumeInfo).toHaveProperty("authors");
      expect(books[0].volumeInfo).toHaveProperty("publishedDate");
    } catch (error) {
      fail("Should not throw any error");
    }
  });
});

const exampleBooks = [
  {
    id: 1,
    volumeInfo: {
      title: "Book 1",
      publishedDate: "2021-01-01",
      authors: ["Author A", "Author B"],
    },
  },
  {
    id: 2,
    volumeInfo: { title: "Book 2", publishedDate: "2022-03-15" },
    authors: ["Author C"],
  },
  {
    id: 3,
    volumeInfo: { title: "Novel 1", publishedDate: "2020-09-30" },
    authors: ["Author D"],
  },
];
describe("processBooks function", () => {
  it("should sort books by published date correctly", async () => {
    const processedBooks = await processBooks(exampleBooks);
    console.log(processedBooks);
    expect(processedBooks).toEqual([
      {
        id: 3,
        volumeInfo: { title: "Novel 1", publishedDate: "2020-09-30" },
        authors: ["Author D"],
      },
      {
        id: 1,
        volumeInfo: {
          title: "Book 1",
          publishedDate: "2021-01-01",
          authors: ["Author A", "Author B"],
        },
      },
      {
        id: 2,
        volumeInfo: { title: "Book 2", publishedDate: "2022-03-15" },
        authors: ["Author C"],
      },
    ]);

    expect(processedBooks.length).toBe(exampleBooks.length);
  });

  it("should throw an error if books is not an array", async () => {
    const invalidInput = "not an array";
    try {
      await processBooks(invalidInput);
    } catch (error) {
      expect(error.message).toBe("Books must be an array");
    }
  });

  it("should handle empty books array gracefully", async () => {
    const emptyBooks = [];
    const processedBooks = await processBooks(emptyBooks);
    expect(processedBooks).toEqual([]);
  });
});

describe("filterBooks function", () => {
  it("should filter books by title", async () => {
    const filteredByTitle = await filterBooks(exampleBooks, "title", "Book");
    console.log(filteredByTitle);
    expect(filteredByTitle.length).toBe(2); // Expecting two books with titles containing 'Book'
    expect(filteredByTitle[0].volumeInfo.title).toBe("Book 1");
    expect(filteredByTitle[1].volumeInfo.title).toBe("Book 2");
  });

  it("should filter books by author", async () => {
    const filteredByAuthor = await filterBooks(
      exampleBooks,
      "author",
      "Author A",
    );
    expect(filteredByAuthor.length).toBe(1); // Expecting one book with Author A
    expect(filteredByAuthor[0].volumeInfo.title).toBe("Book 1");
  });

  it("should handle empty filterValue gracefully", async () => {
    const filtered = await filterBooks(exampleBooks, "title", "");
    expect(filtered.length).toBe(exampleBooks.length); // Expecting all books to be returned when filterValue is empty
  });

  it("should handle invalid filterType gracefully", async () => {
    const filtered = await filterBooks(
      exampleBooks,
      "invalidFilter",
      "Some Value",
    );
    expect(filtered).toEqual([]); // Expecting an empty array due to invalid filterType
  });
});
