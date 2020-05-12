import { expect } from 'chai';
const { GraphQLServer } = require('graphql-yoga')
const g = require('graphql');
import { request } from 'supertest';

import { getRepository, Repository } from 'typeorm';
import { User } from '../entities/user';

async function app(): Promise<any> {
    const schema = await graphql.getSchema();
  
    const server = new GraphQLServer({ schema });
  
    return server;


describe('GraphQL', () => {
    it("teste", () => {
        expect(1).to.be.equal(2)
    })
})