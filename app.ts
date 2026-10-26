import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import { escrowTypeDefs, escrowOfferTypeDefs } from "./schema/typeDefs/index.js"
import { resolvers } from "./schema/resolvers/index.js"

const server = new ApolloServer({
    typeDefs: [escrowTypeDefs, escrowOfferTypeDefs],
    resolvers,
    introspection: process.env.APP_ENV !== "prod"
})

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
})

console.log(`🚀  Server ready at: ${url}`)
