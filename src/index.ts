import 'reflect-metadata';
import{createConnection, getRepository, Repository } from 'typeorm';
import { User } from './entities/User';

const { GraphQLServer } = require('graphql-yoga')

const typeDefs = `
input LoginInputType {
  email: String!
  password: String!
}
type UserType {
  id: ID!
  name: String!
  email: String!
  birthDate: String!
  cpf: Int!
}
type LoginType {
  user: UserType!
  token: String!
}
type Query {
  user(id: ID!): UserType!
}
type Mutation {
  login(data:LoginInputType!): LoginType!
}
`

class LoginType {
  user: User;
  token: string;

  constructor( user: User ,token: string ) {
    this.user = user;
    this.token = token;
  }
}

const resolvers = {
  
  Mutation: {
    // this is the login resolver
    login: async (_, { data } ) => {
      const repo: Repository<User> = getRepository(User);

      const user: User = await repo.findOne({
        where: [
          { email: data.email }
        ]
      });
        console.log("Deu ruim!");
      
      if (user.password == data.password) {

        const token = "";
        console.log("Deu bom!")
        return new LoginType(user, token);

      } else {
        console.log("Deu ruim!")
      };
    },
  },
}

createConnection();

const server = new GraphQLServer({
  typeDefs,
  resolvers,
})

server.start(() => console.log(`Server is running on http://localhost:4000`))