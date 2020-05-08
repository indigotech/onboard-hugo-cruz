import 'reflect-metadata';
import{createConnection, getRepository } from 'typeorm';
import { User } from './User';

const { GraphQLServer } = require('graphql-yoga')

const typeDefs = `
type User {
  id: ID!
  name: String!
  email: String!
}
type Mutation {
  addUser(name: String!, email: String!): User
}
`
const resolvers = {
  Mutation: {
    // this is the addUser resolver
    addUser: (_, { name, email }) => {
      const user = new User()
      user.email = email
      user.name = name
      return getRepository(User).save(user)
    },
  },
}

createConnection();

const server = new GraphQLServer({
  typeDefs,
  resolvers,
})

server.start(() => console.log(`Server is running on http://localhost:4000`))