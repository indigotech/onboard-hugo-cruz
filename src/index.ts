import 'reflect-metadata';
import{createConnection, getRepository, Repository } from 'typeorm';
import { User } from './entities/User';

var crypto = require('crypto')

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

  Query: {
    
    async user (_, { id }){
      const user: User = await getRepository(User).findOne(id);

      if (user == undefined) {
        throw ("Invalid id.");
      }
      
      return user;
    },
  },
  
  Mutation: {

    login: async (_, { data } ) => {
  
      const user: User = await getRepository(User).findOne({
        where: [
          { email: data.email }
        ]
      });
      
      if (user == undefined) {
        throw ("Invalid credentials, please check your e-mail and password");
      }

      data.password = crypto.createHash('md5').update(data.password).digest("hex");
      if (user.password == data.password) {

        const token = "";

        return new LoginType(user, token);

      } else {
        throw ("Invalid credentials, please check your e-mail and password");
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