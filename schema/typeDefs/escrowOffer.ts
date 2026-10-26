// Mirrors the DirectoryEscrow entities of evm_directory_subgraph: EscrowOffer and
// EscrowOfferEvent, i.e. our own Escrow contract from evm_directory_chain.
// Big integers are returned as strings. EscrowOutcome is defined in escrow.ts.
export const escrowOfferTypeDefs = `#graphql
    enum OfferSide {
        SELL
        BUY
    }

    "EXPIRED: accepted but not settled within the contract's settlement period, so the buyer was refunded"
    enum OfferStatus {
        OPEN
        ACCEPTED
        CANCELLED
        COMPLETED
        REFUNDED
        EXPIRED
    }

    enum OfferEventType {
        CREATED
        ACCEPTED
        CANCELLED
        SALE_EXECUTED
        REFUNDED
        EXPIRED
    }

    type EscrowOfferEvent {
        id: ID!
        type: OfferEventType!
        actor: String
        amount: String
        blockNumber: String!
        blockTimestamp: String!
        transactionHash: String!
    }

    type EscrowOffer {
        "<contract address>-<offerId>"
        id: ID!
        offerId: String!
        contract: String!
        side: OfferSide!
        creator: String!
        seller: String!
        buyer: String!
        "Price in wei"
        amount: String!
        "USD value (18 decimals) from the Chainlink ETH/USD feed at creation"
        usdValue: String!
        status: OfferStatus!
        outcome: EscrowOutcome!
        createdAt: String!
        createdBlock: String!
        createdTx: String!
        acceptedAt: String
        "After this unix time anyone (or the Chainlink Automation upkeep) can expire the offer"
        expiresAt: String
        "True when the offer is ACCEPTED and expiresAt has passed but nobody has expired it yet"
        expirable: Boolean!
        closedBy: String
        closedAt: String
        updatedAt: String!
        events: [EscrowOfferEvent!]!
    }

    input EscrowOfferFilter {
        status: OfferStatus
        outcome: EscrowOutcome
        side: OfferSide
        seller: String
        buyer: String
    }

    extend type Query {
        "Offers on our DirectoryEscrow contract, newest first"
        escrowOffers(first: Int = 20, skip: Int = 0, where: EscrowOfferFilter): [EscrowOffer!]!
        "One offer by id (<contract address>-<offerId>)"
        escrowOffer(id: ID!): EscrowOffer
    }
`
