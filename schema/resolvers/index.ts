import { bookResolvers } from './book.js'

export const resolvers = {
    Query: {
        ...bookResolvers.Query,
    },
}
