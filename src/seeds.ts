import * as faker from 'faker';
import { getRepository, createConnection, Connection } from 'typeorm';
import { User } from './entities/user'
import { hashPassword} from './hash-password'
import * as dotenv from 'dotenv';
import path from 'path';

export const populateDB = async (users = 20) => {

    dotenv.config({ path: path.join(__dirname, '..', ".env.test") });
    
    let dbConnection = await createConnection();

    const repository = getRepository(User)

    const newusers = Array.from({ length: users }).map(() => {
        const newUser: User = new User();
        newUser.name = faker.name.findName();
        newUser.email = faker.internet.email();
        newUser.birthDate = faker.date.past();
        newUser.cpf = faker.random.number();
        newUser.password = hashPassword('password1');
        return newUser;
      })

    await repository.save(newusers)
    dbConnection.close()
    
}

populateDB();