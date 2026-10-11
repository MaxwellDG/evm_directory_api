import { GraphQLClient } from "graphql-request"

let client: GraphQLClient | undefined

/**
 * GraphQL client for the escrow subgraph (MaxwellDG/evm_directory_subgraph).
 *
 * SUBGRAPH_URL      required, the subgraph query endpoint (Studio or gateway URL)
 * SUBGRAPH_API_KEY  optional, sent as a Bearer token (needed for gateway.thegraph.com)
 */
export function subgraphClient(): GraphQLClient {
    if (client) return client
    const url = process.env.SUBGRAPH_URL
    if (!url) {
        throw new Error("SUBGRAPH_URL is not set. Point it at the deployed escrow subgraph's query URL.")
    }
    const apiKey = process.env.SUBGRAPH_API_KEY
    client = new GraphQLClient(url, apiKey ? { headers: { Authorization: `Bearer ${apiKey}` } } : {})
    return client
}
