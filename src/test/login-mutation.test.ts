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

describe('Login mutation tests', () => {

  let agent;
  let repository: Repository<User>;

  const loginMutation = (variable: {data} ) => {

    const query = `
        mutation ( $data: LoginInputType! ) { 
        login(data: $data) { 
        
            user { 
                id 
                name 
                email 
                birthDate 
                cpf } 
            token 
        }
    }`;
    
    return agent.post("/").send({ query: query, variables: variable })
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

  it('should login successfully', async function() {

    const res = await loginMutation( {data: { email:EMAIL, password:PASSW, rememberMe: REMEMBER }});

    expect(NAME).to.be.equals(res.body.data.login.user.name);
    expect(EMAIL).to.be.equals(res.body.data.login.user.email);
    expect(BDATE).to.be.equals(res.body.data.login.user.birthDate);
    expect(CPF).to.be.equals(res.body.data.login.user.cpf);
    expect(res.body.data.login.token).is.not.empty;

   });

  it('should return email not found', async function() {
    
    const res = await loginMutation( {data: { email:"wrong@gmail.com", password:PASSW, rememberMe: REMEMBER }});
    expect(res.body.errors[0].message).to.be.equals(EMAIL_NOT_FOUND);
  })

  it('should return email invalid credentials', async function() {
    
    const res = await loginMutation( {data: { email:EMAIL, password:"wrong", rememberMe: REMEMBER }});
    expect(res.body.errors[0].message).to.be.equals(INVALID_CREDENTIALS);
  })

  it('should rememberBe be optional', async function() {
    const res = await loginMutation({data: { email:EMAIL, password: PASSW }});
    expect(res.body.errors).to.be.undefined;
  });

  it('should return 10 min', async function() {
    const res = await loginMutation({data : { email: EMAIL, password: PASSW, rememberMe: false }});
    const payload = jwt.decode(res.body.data.login.token);
    expect(payload.exp - payload.iat).to.be.equals(TEN_MINUTES);
  });

  it('should return one week', async function() {
    const res = await loginMutation({data : { email: EMAIL, password: PASSW, rememberMe: true }});
    const payload = jwt.decode(res.body.data.login.token);
    expect(payload.exp - payload.iat).to.be.equals(ONE_WEEK);
  });

})
