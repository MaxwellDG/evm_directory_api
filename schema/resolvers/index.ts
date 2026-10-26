import { escrowResolvers } from './escrow.js'

export const resolvers = {
    Query: {
        ...escrowResolvers.Query,
    },
}
