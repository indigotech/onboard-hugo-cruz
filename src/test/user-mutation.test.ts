import { expect } from 'chai'
import  requests from 'supertest';
import { getRepository, Repository } from 'typeorm';
import {User} from '../entities/user'
import { hashPassword } from '../hash-password';
import * as jwt from 'jsonwebtoken';
import {EMAIL_DUPLICATED, PASSW_DIGIT, PASSW_LETTERS, PASSW_SHORT} from '../errors';
import {TEN_MINUTES, ONE_WEEK, APP_SECRET} from '../consts';

const NAME = "Hugo"
const EMAIL = "hugo@gmail.com"
const EMAIL2 = "joao@gmail.com"
const PASSW = "12345"
const CPF = "12345678900"
const BDATE = "04/06/1993"

describe('User mutation tests', () => {

  let agent;
  let repository: Repository<User>;

  const userMutation = (variable: {data}, token) => {

    const query = `
    mutation ( $data: CreateUserInput! ){
      createUser(data: $data) {
        id 
        name 
        email 
        birthDate 
        cpf

      }
    }
    `
    return agent.post("/").send({ query: query, variables: variable }).set('Authorization', token)
  }

  before(async () => {
    agent = requests('http://localhost:4000');
    repository = getRepository(User);

    const user = new User();

    user.name = NAME;
    user.email = EMAIL;
    user.birthDate = BDATE;
    user.cpf = CPF;
    user.password = hashPassword(PASSW);

    await repository.save(user);

  })

  after( async () => {
    await repository.delete({ email: EMAIL})
    await repository.delete({ email: EMAIL2})
  })

  it('System should not allow two or more users with the same e-mail', async function() {
    var token = jwt.sign({ userId: 1 }, APP_SECRET, { expiresIn: TEN_MINUTES }); 
    const res = await userMutation( {data: { name: NAME, email:EMAIL, birthDate:BDATE, cpf:CPF, password:PASSW }}, token);
    expect(res.body.errors[0].message).to.be.equals(EMAIL_DUPLICATED);

  });
  it('Password should have at least 1 digit', async function() {
    var token = jwt.sign({ userId: 1 }, APP_SECRET, { expiresIn: TEN_MINUTES }); 
    const res = await userMutation( {data: { name: NAME, email:EMAIL2, birthDate:BDATE, cpf:CPF, password:"password" }}, token);
    expect(res.body.errors[0].message).to.be.equals(PASSW_DIGIT);

  })
  it('Password should have at least 1 digit', async function() {
    var token = jwt.sign({ userId: 1 }, APP_SECRET, { expiresIn: TEN_MINUTES }); 
    const res = await userMutation( {data: { name: NAME, email:EMAIL2, birthDate:BDATE, cpf:CPF, password:"1234567890" }}, token);
    expect(res.body.errors[0].message).to.be.equals(PASSW_LETTERS);

  })

  it('Password should have at least 1 digit', async function() {
    var token = jwt.sign({ userId: 1 }, APP_SECRET, { expiresIn: TEN_MINUTES }); 
    const res = await userMutation( {data: { name: NAME, email:EMAIL2, birthDate:BDATE, cpf:CPF, password:"pass1" }}, token);
    expect(res.body.errors[0].message).to.be.equals(PASSW_SHORT);

  })

})
