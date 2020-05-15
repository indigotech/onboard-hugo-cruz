import { getRepository } from 'typeorm';
import { User } from '../entities/user'
import {ID_NOT_FOUND} from '../errors';

export default {
    Query: {
        
        async user (_, { id }){
        const user: User = await getRepository(User).findOne(id);

        if (user === undefined) {
            throw new Error(ID_NOT_FOUND)
        }
        
        return user;
        },
    },
}