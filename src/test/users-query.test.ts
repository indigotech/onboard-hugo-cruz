import { expect } from 'chai';
import * as faker from 'faker';
import  requests from 'supertest';
import { getRepository, Repository } from 'typeorm';
import { User } from '../entities/user';
import { hashPassword } from '../hash-password';
import * as jwt from 'jsonwebtoken';
import {AUTHEN_ERROR} from '../errors';
import {TEN_MINUTES, APP_SECRET} from '../consts';

const NUMBER_OF_USERS = 55;

describe('Users query tests', () => {

  let agent;
  let repository: Repository<User>;
  let token;

  const usersQuery = (token, variable?: { limit?, offset?}) => {

    const query = `
    query ($limit: Int, $offset: Int ) {
      users (limit: $limit, offset: $offset ) {
        users {
          id 
          name 
          email 
          birthDate 
          cpf
        }
        total
        info {
          before
          after
        }
      }
    }
    `
    return agent.post("/").send({ query: query, variables: variable }).set('Authorization', token)
  }

  before(async () => {

    agent = requests('http://localhost:4000');
    
    repository = getRepository(User)

    const newusers = Array.from({ length: NUMBER_OF_USERS }).map(() => {
        const newUser: User = new User();
        newUser.name = faker.name.findName();
        newUser.email = faker.internet.email();
        newUser.birthDate = faker.date.past();
        newUser.cpf = faker.random.number();
        newUser.password = hashPassword('password1');
        return newUser;
      })

    await repository.save(newusers)

  })

  beforeEach( async () => {
    token = jwt.sign({ userId: 1 }, APP_SECRET, { expiresIn: TEN_MINUTES }); 
  })

  after( async () => {
    await repository.clear()
  })

  it('should return the first ten users', async function() {

      const res = await usersQuery(token, { limit: 10, offset: 0 });

      expect(res.body.data.users.total).to.be.equals(NUMBER_OF_USERS);
      expect(res.body.data.users.info.before).to.be.equals(false);
      expect(res.body.data.users.info.after).to.be.equals(true);
      expect(res.body.data.users.users.length).to.be.equals(10);  
  });

  it('should return the last five users (total < offset + limit)', async function() {

    const res = await usersQuery(token, { limit: 10, offset: 50 });

    expect(res.body.data.users.total).to.be.equals(NUMBER_OF_USERS);
    expect(res.body.data.users.info.before).to.be.equals(true);
    expect(res.body.data.users.info.after).to.be.equals(false);
    expect(res.body.data.users.users.length).to.be.equals(5);   
  });

  it('should return all users (limit > total)', async function() {

    const res = await usersQuery(token, { limit: 100, offset: 0 });

    expect(res.body.data.users.total).to.be.equals(NUMBER_OF_USERS);
    expect(res.body.data.users.info.before).to.be.equals(false);
    expect(res.body.data.users.info.after).to.be.equals(false);
    expect(res.body.data.users.users.length).to.be.equals(55);    
  });

  it('should return zero users (offset > total)', async function() {

    const res = await usersQuery(token, { limit: 10, offset: 60 });

    expect(res.body.data.users.total).to.be.equals(NUMBER_OF_USERS);
    expect(res.body.data.users.info.before).to.be.equals(true);
    expect(res.body.data.users.info.after).to.be.equals(false);
    expect(res.body.data.users.users.length).to.be.equals(0);    
  });

  it('should return the first ten users (limit == default, offset == default)', async function() {

    const res = await usersQuery(token);

    expect(res.body.data.users.total).to.be.equals(NUMBER_OF_USERS);
    expect(res.body.data.users.info.before).to.be.equals(false);
    expect(res.body.data.users.info.after).to.be.equals(true);
    expect(res.body.data.users.users.length).to.be.equals(10);    
  });

  it('should return ten users skipping ten (limit == default, offset != default)', async function() {

    const res = await usersQuery(token, { offset: 10 });

    expect(res.body.data.users.total).to.be.equals(NUMBER_OF_USERS);
    expect(res.body.data.users.info.before).to.be.equals(true);
    expect(res.body.data.users.info.after).to.be.equals(true);
    expect(res.body.data.users.users.length).to.be.equals(10);    
  });

  it('should return the first five users (limit != default, offset == default)', async function() {

    const res = await usersQuery(token, { limit: 5 });

    expect(res.body.data.users.total).to.be.equals(NUMBER_OF_USERS);
    expect(res.body.data.users.info.before).to.be.equals(false);
    expect(res.body.data.users.info.after).to.be.equals(true);
    expect(res.body.data.users.users.length).to.be.equals(5);    
  });

  it('should give an error if token is expired', async function() {
    token = jwt.sign({ userId: 1 }, APP_SECRET, { expiresIn: 0 }); 
    const res = await usersQuery(token);
    expect(res.body.errors[0].message).to.be.equals(AUTHEN_ERROR);
  })

  it('should give an error if token is invalid', async function() {
    token = "wrongtoken"
    const res = await usersQuery(token);
    expect(res.body.errors[0].message).to.be.equals(AUTHEN_ERROR);
  })

})
