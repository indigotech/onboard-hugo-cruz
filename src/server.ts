import 'reflect-metadata';
import { default as typeDefs } from './typedefs'
import { default as resolvers } from './resolvers'

const { GraphQLServer } = require('graphql-yoga')

export const startServer = async () => {    

  const server = new GraphQLServer({
    typeDefs,
    resolvers,
  })

  await server.start(() => console.log(`Server is running on http://localhost:4000`))
}