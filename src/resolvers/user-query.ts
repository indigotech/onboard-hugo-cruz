import 'reflect-metadata';
import { getRepository } from 'typeorm';
import { User } from '../entities/user'
import {INVALID_ID} from '../errors';

export default {
    Query: {
        
        async user (_, { id }){
        const user: User = await getRepository(User).findOne(id);

        if (user === undefined) {
            throw new Error(INVALID_ID);
        }
        
        return user;
        },
    },
}