import { books } from '../../data/books.js'

export const bookResolvers = {
    Query: {
        books: () => books,
    },
}
