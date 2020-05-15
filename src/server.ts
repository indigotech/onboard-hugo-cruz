import 'reflect-metadata';
import { Connection } from 'typeorm';
import { configServer } from './config'
import { GraphQLServer } from "graphql-yoga";

import { default as typeDefs } from './typedefs'
import { default as resolvers } from './resolvers'

export const startServer = async () => {   
  
  let dbConnection: Connection = await configServer();
  
  const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context: ({ request, response }) => {
      return { request, response };
    },
  })

  await server.start(() => console.log(`Server is running on http://localhost:4000`))

}