# EVM Directory API

Apollo GraphQL server that answers questions about on-chain escrow deals
(how many go through vs. fall through) by querying the companion subgraph
[MaxwellDG/evm_directory_subgraph](https://github.com/MaxwellDG/evm_directory_subgraph).

## Network: Ethereum Sepolia (testnet only)

Tracked contract: **Escrow** (UUPS proxy) `0x1Ad0aD503C0769B97DE1d1B2C25521204C935A6b`
- Verified implementation: `0xfe836e1d0e2daC6cAbd7B710804Aa9F2bDf8Df40` (Blockscout, full match)
- Created at block 11766363
- Uses Chainlink `AggregatorV3Interface` price feeds to price deals in USD for fee tiers

> Note: an earlier version of this file named Roofstock onChain contracts
> (`0x35002C93...10D8`, `0x296B2177...213c`) on Ethereum mainnet. Neither
> address has any contract code on mainnet or Sepolia, Roofstock onChain has
> no Sepolia deployment, and its public contracts emit no
> OfferCreated/OfferAccepted/OfferCancelled/SaleExecuted events.

## Escrow lifecycle (real contract events)

| Intent | Contract event(s) |
| --- | --- |
| Offer created | `EscrowCreated` |
| Offer accepted | `SellerAgreed` + `EscrowFunded` (deal is live once both happened; a seller-created deal is pre-agreed) |
| Offer cancelled ("fall through" before funding is locked) | `EscrowCancelled` |
| Sale executed ("closing") | `Released`, or `DisputeResolved` with a 100% seller split |
| Fell through after funding | `Refunded`, or `DisputeResolved` with a partial split |
| Disputes | `DisputeRaised`, `DisputeEscalated`, `DisputeCancelled` |

## Queries

```graphql
{
  escrowStats { created open succeeded failed successRate }
  escrows(first: 10, where: { outcome: FAILED }) { id status seller buyer amount events { type blockTimestamp } }
  escrow(id: "0") { status outcome deposit sellerAmount }
}
```

## Configuration

| Env var | Required | Description |
| --- | --- | --- |
| `SUBGRAPH_URL` | yes | Query URL of the deployed escrow subgraph (Subgraph Studio or gateway URL) |
| `SUBGRAPH_API_KEY` | no | Sent as `Authorization: Bearer <key>`; needed for `gateway.thegraph.com` URLs |
| `APP_ENV` | no | Set to `prod` to disable introspection |

Copy `.env.example` to `.env`, then:

```sh
pnpm install
pnpm dev        # or: pnpm start
pnpm typecheck
```
