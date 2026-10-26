import { escrowResolvers } from './escrow.js'
import { escrowOfferResolvers } from './escrowOffer.js'

export const resolvers = {
    Query: {
        ...escrowResolvers.Query,
        ...escrowOfferResolvers.Query,
    },
    EscrowOffer: escrowOfferResolvers.EscrowOffer,
}
