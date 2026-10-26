import { gql } from "graphql-request"
import { subgraphClient } from "../../lib/subgraph.js"

const OFFER_FIELDS = `
    id
    offerId
    contract
    side
    creator
    seller
    buyer
    amount
    usdValue
    status
    outcome
    createdAt
    createdBlock
    createdTx
    acceptedAt
    expiresAt
    closedBy
    closedAt
    updatedAt
    events(orderBy: blockNumber, orderDirection: asc) {
        id
        type
        actor
        amount
        blockNumber
        blockTimestamp
        transactionHash
    }
`

const OFFERS_QUERY = gql`
    query EscrowOffers($first: Int!, $skip: Int!, $where: EscrowOffer_filter) {
        escrowOffers(first: $first, skip: $skip, where: $where, orderBy: createdBlock, orderDirection: desc) {
            ${OFFER_FIELDS}
        }
    }
`

const OFFER_QUERY = gql`
    query EscrowOffer($id: ID!) {
        escrowOffer(id: $id) {
            ${OFFER_FIELDS}
        }
    }
`

type OfferFilter = {
    status?: string | null
    outcome?: string | null
    side?: string | null
    seller?: string | null
    buyer?: string | null
}

type OfferRow = { status: string; expiresAt: string | null }

const MAX_FIRST = 1000

export function toOfferWhere(filter: OfferFilter | null | undefined): Record<string, string> {
    const where: Record<string, string> = {}
    if (!filter) return where
    if (filter.status) where.status = filter.status
    if (filter.outcome) where.outcome = filter.outcome
    if (filter.side) where.side = filter.side
    // subgraph stores addresses as lowercase Bytes
    if (filter.seller) where.seller = filter.seller.toLowerCase()
    if (filter.buyer) where.buyer = filter.buyer.toLowerCase()
    return where
}

/** ACCEPTED offers whose settlement deadline has passed but which nobody has expired on-chain yet. */
export function isExpirable(offer: OfferRow, nowSeconds = Math.floor(Date.now() / 1000)): boolean {
    return offer.status === "ACCEPTED" && offer.expiresAt != null && Number(offer.expiresAt) <= nowSeconds
}

export const escrowOfferResolvers = {
    Query: {
        escrowOffers: async (_: unknown, args: { first?: number; skip?: number; where?: OfferFilter | null }) => {
            const first = Math.min(Math.max(args.first ?? 20, 1), MAX_FIRST)
            const skip = Math.max(args.skip ?? 0, 0)
            const data = await subgraphClient().request<{ escrowOffers: OfferRow[] }>(OFFERS_QUERY, {
                first,
                skip,
                where: toOfferWhere(args.where),
            })
            return data.escrowOffers
        },
        escrowOffer: async (_: unknown, args: { id: string }) => {
            const data = await subgraphClient().request<{ escrowOffer: OfferRow | null }>(OFFER_QUERY, {
                id: args.id.toLowerCase(),
            })
            return data.escrowOffer
        },
    },
    EscrowOffer: {
        expirable: (offer: OfferRow) => isExpirable(offer),
    },
}
