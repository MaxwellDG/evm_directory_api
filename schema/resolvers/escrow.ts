import { gql } from "graphql-request"
import { subgraphClient } from "../../lib/subgraph.js"

const ESCROW_FIELDS = `
    id
    escrowId
    contract
    creator
    seller
    buyer
    broker
    token
    amount
    feeBps
    brokerBps
    challengeWindow
    detailsHash
    status
    outcome
    sellerAgreed
    buyerFunded
    deposit
    sellerAmount
    brokerAmount
    feeAmount
    buyerRefundAmount
    resolvedSellerBps
    createdAt
    createdBlock
    createdTx
    updatedAt
    closedAt
    events(orderBy: blockNumber, orderDirection: asc) {
        id
        type
        actor
        party
        amount
        blockNumber
        blockTimestamp
        transactionHash
    }
`

const ESCROWS_QUERY = gql`
    query Escrows($first: Int!, $skip: Int!, $where: Escrow_filter) {
        escrows(first: $first, skip: $skip, where: $where, orderBy: createdBlock, orderDirection: desc) {
            ${ESCROW_FIELDS}
        }
    }
`

const ESCROW_QUERY = gql`
    query Escrow($id: ID!) {
        escrow(id: $id) {
            ${ESCROW_FIELDS}
        }
    }
`

const STATS_QUERY = gql`
    query EscrowStats {
        escrowStats(id: "global") {
            created
            funded
            open
            succeeded
            failed
            released
            refunded
            cancelled
            disputed
            updatedAt
        }
    }
`

type EscrowFilter = {
    status?: string | null
    outcome?: string | null
    seller?: string | null
    buyer?: string | null
}

type EscrowsArgs = { first?: number; skip?: number; where?: EscrowFilter | null }

type StatsRow = {
    created: string
    funded: string
    open: string
    succeeded: string
    failed: string
    released: string
    refunded: string
    cancelled: string
    disputed: string
    updatedAt: string
}

const MAX_FIRST = 1000

function toSubgraphWhere(filter: EscrowFilter | null | undefined): Record<string, string> {
    const where: Record<string, string> = {}
    if (!filter) return where
    if (filter.status) where.status = filter.status
    if (filter.outcome) where.outcome = filter.outcome
    // subgraph stores addresses as lowercase Bytes
    if (filter.seller) where.seller = filter.seller.toLowerCase()
    if (filter.buyer) where.buyer = filter.buyer.toLowerCase()
    return where
}

export const escrowResolvers = {
    Query: {
        escrows: async (_: unknown, args: EscrowsArgs) => {
            const first = Math.min(Math.max(args.first ?? 20, 1), MAX_FIRST)
            const skip = Math.max(args.skip ?? 0, 0)
            const data = await subgraphClient().request<{ escrows: unknown[] }>(ESCROWS_QUERY, {
                first,
                skip,
                where: toSubgraphWhere(args.where),
            })
            return data.escrows
        },
        escrow: async (_: unknown, args: { id: string }) => {
            const data = await subgraphClient().request<{ escrow: unknown | null }>(ESCROW_QUERY, { id: args.id })
            return data.escrow
        },
        escrowStats: async () => {
            const data = await subgraphClient().request<{ escrowStats: StatsRow | null }>(STATS_QUERY)
            const s = data.escrowStats
            if (!s) {
                // nothing indexed yet
                const zero = "0"
                return {
                    created: zero, funded: zero, open: zero, succeeded: zero, failed: zero,
                    released: zero, refunded: zero, cancelled: zero, disputed: zero,
                    successRate: null, updatedAt: null,
                }
            }
            const succeeded = Number(s.succeeded)
            const closed = succeeded + Number(s.failed)
            return { ...s, successRate: closed > 0 ? succeeded / closed : null }
        },
    },
}
