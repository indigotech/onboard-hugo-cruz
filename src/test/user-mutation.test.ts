import { expect } from 'chai'
import  requests from 'supertest';
import { getRepository, Repository } from 'typeorm';
import {User} from '../entities/user'
import { hashPassword } from '../hash-password';
import * as jwt from 'jsonwebtoken';
import {INVALID_CREDENTIALS, EMAIL_NOT_FOUND} from '../errors';
import {TEN_MINUTES, ONE_WEEK, APP_SECRET} from '../consts';

const NAME = "Hugo"
const EMAIL = "hugo@gmail.com"
const PASSW = "12345"
const CPF = "12345678900"
const BDATE = "04/06/1993"
const REMEMBER = false;

describe('User mutation tests', () => {

  let agent;
  let repository: Repository<User>;

  const userMutation = (variable: {data}, token) => {

    const query = `
    mutation ( $data: CreateUserInput! ){
      createUser(user: $data) {
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
  })

  it('USUARIO JA EXISTE', async function() {
    var token = jwt.sign({ userId: 1 }, APP_SECRET, { expiresIn: TEN_MINUTES }); 
    const res = await userMutation( {data: { name: NAME, email:EMAIL, birthDate:BDATE, cpf:CPF, password:PASSW }}, token);
   });

  // it('should return email not found', async function() {
    
  //   const res = await loginMutation( {data: { email:"wrong@gmail.com", password:PASSW, rememberMe: REMEMBER }});
  //   expect(res.body.errors[0].message).to.be.equals(EMAIL_NOT_FOUND);
  // })

  // it('should return email invalid credentials', async function() {
    
  //   const res = await loginMutation( {data: { email:EMAIL, password:"wrong", rememberMe: REMEMBER }});
  //   expect(res.body.errors[0].message).to.be.equals(INVALID_CREDENTIALS);
  // })

  // it('should rememberBe be optional', async function() {
  //   const res = await loginMutation({data: { email:EMAIL, password: PASSW }});
  //   expect(res.body.errors).to.be.undefined;
  // });

  // it('should return 10 min', async function() {
  //   const res = await loginMutation({data : { email: EMAIL, password: PASSW, rememberMe: false }});
  //   const payload = jwt.decode(res.body.data.login.token);
  //   expect(payload.exp - payload.iat).to.be.equals(TEN_MINUTES);
  // });

  // it('should return one week', async function() {
  //   const res = await loginMutation({data : { email: EMAIL, password: PASSW, rememberMe: true }});
  //   const payload = jwt.decode(res.body.data.login.token);
  //   expect(payload.exp - payload.iat).to.be.equals(ONE_WEEK);

  //   console.log(res)
  // });

})
