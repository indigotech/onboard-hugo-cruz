import 'reflect-metadata';
import{createConnection, getRepository } from 'typeorm';
import { User } from './entities/User';

const { GraphQLServer } = require('graphql-yoga')

const typeDefs = `
type UserType {
  id: ID!
  name: String!
  email: String!
  birthDate: Data!
  cpf: Int!
}
type LoginInputType {
  email: String!
  password: String!
}
type LoginType {
  user: UserType!
  token: String!
}
type Mutation {
  login(data:LoginInputType!): LoginType!
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