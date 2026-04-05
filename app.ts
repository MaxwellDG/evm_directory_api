import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import { bookTypeDefs } from "./schema/typeDefs/index.js"
import { resolvers } from "./schema/resolvers/index.js"

const server = new ApolloServer({
    typeDefs: bookTypeDefs,
    resolvers,
    introspection: process.env.APP_ENV !== "prod"
})

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
})

console.log(`🚀  Server ready at: ${url}`)
