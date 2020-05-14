import { expect } from 'chai'
import  requests from 'supertest';
import { getRepository } from 'typeorm';
import { startServer } from '../server'; 



describe('List', () => {

  let agent;

  before(async () => {
    await startServer();
    agent = requests('http://localhost:4000');
  })

  it('should login successfully', async function() {

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

   const res = await loginMutation( {data: { email:"hugo@gmail.com", password:"1234", rememberMe: true }});
   console.log(res)
   });
})
