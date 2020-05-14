import 'reflect-metadata';
import { getRepository } from 'typeorm';
import { User } from './entities/user';
import { hashPassword } from './hash-password';
import {INVALID_ID, INVALID_CREDENTIALS, EMAIL_NOT_FOUND} from './errors';
import {TEN_MINUTES, ONE_WEEK, APP_SECRET} from './consts';

var jwt = require('jsonwebtoken');

const { GraphQLServer } = require('graphql-yoga')

export const startServer = async () => {

  const typeDefs = `
  input LoginInputType {
    email: String!
    password: String!
    rememberMe: Boolean
  }
  type UserType {
    id: ID!
    name: String!
    email: String!
    birthDate: String!
    cpf: String!
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
  
        if (user === undefined) {
          throw new Error(INVALID_ID);
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
        
        if (!user) {
          throw new Error(EMAIL_NOT_FOUND);
        }
  
        if (user.password == hashPassword(data.password)) {
  
          var exp_time: number = TEN_MINUTES;
  
          if (data.rememberMe){
            exp_time = ONE_WEEK;
          };
  
          const token = jwt.sign({ userId: user.id }, APP_SECRET, {expiresIn: exp_time}); 
  
          return new LoginType(user, token);
  
        } else {
          throw new Error(INVALID_CREDENTIALS);
        };
      },
    },
  }

  const server = new GraphQLServer({
    typeDefs,
    resolvers,
  })

  await server.start(() => console.log(`Server is running on http://localhost:4000`))
}