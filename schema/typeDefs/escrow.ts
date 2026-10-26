// Mirrors the entities of the escrow subgraph (evm_directory_subgraph):
// Escrow, EscrowEvent and EscrowStats. Big integers are returned as strings.
export const escrowTypeDefs = `#graphql
    enum EscrowStatus {
        CREATED
        FUNDED
        CLAIMED
        DISPUTED
        RELEASED
        REFUNDED
        CANCELLED
    }

    "Whether a deal went through (seller paid) or fell through (cancelled/refunded)"
    enum EscrowOutcome {
        PENDING
        SUCCEEDED
        FAILED
    }

    enum EscrowEventType {
        CREATED
        SELLER_AGREED
        FUNDED
        CANCELLED
        RELEASED
        REFUNDED
        DISPUTE_RAISED
        DISPUTE_ESCALATED
        DISPUTE_CANCELLED
        DISPUTE_RESOLVED
    }

    enum EscrowParty {
        NONE
        BUYER
        SELLER
    }

    type EscrowEvent {
        id: ID!
        type: EscrowEventType!
        actor: String
        party: EscrowParty
        amount: String
        blockNumber: String!
        blockTimestamp: String!
        transactionHash: String!
    }

    type Escrow {
        id: ID!
        escrowId: String!
        contract: String!
        creator: String!
        seller: String!
        buyer: String!
        broker: String!
        token: String!
        amount: String!
        feeBps: Int!
        brokerBps: Int!
        challengeWindow: String!
        detailsHash: String!
        status: EscrowStatus!
        outcome: EscrowOutcome!
        sellerAgreed: Boolean!
        buyerFunded: Boolean!
        deposit: String
        sellerAmount: String
        brokerAmount: String
        feeAmount: String
        buyerRefundAmount: String
        resolvedSellerBps: Int
        createdAt: String!
        createdBlock: String!
        createdTx: String!
        updatedAt: String!
        closedAt: String
        events: [EscrowEvent!]!
    }

    type EscrowStats {
        created: String!
        funded: String!
        open: String!
        succeeded: String!
        failed: String!
        released: String!
        refunded: String!
        cancelled: String!
        disputed: String!
        "succeeded / (succeeded + failed), null until a deal has closed"
        successRate: Float
        updatedAt: String
    }

    input EscrowFilter {
        status: EscrowStatus
        outcome: EscrowOutcome
        seller: String
        buyer: String
    }

    type Query {
        "Escrow deals, newest first"
        escrows(first: Int = 20, skip: Int = 0, where: EscrowFilter): [Escrow!]!
        "One escrow deal by its on-chain id"
        escrow(id: ID!): Escrow
        "Aggregated success/fail counters across all deals"
        escrowStats: EscrowStats!
    }
`
