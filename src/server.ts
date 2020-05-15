import { GraphQLServer } from "graphql-yoga";
import * as dotenv from 'dotenv';
import path from 'path';
import {createConnection} from 'typeorm';

import { default as typeDefs } from './typedefs'
import { default as resolvers } from './resolvers'

export const startServer = async () => {   
  
  const isTestMode: boolean = process.env.TEST === 'true';
  const envFileName = isTestMode ? '.env.test' : '.env';
  dotenv.config({ path: path.join(__dirname, '..', envFileName) });
  await createConnection();
    
  const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context: ({ request, response }) => {
      return { request, response };
    },
  })

  await server.start(() => {
    console.log(`Server is running on http://localhost:4000`)
  })

}