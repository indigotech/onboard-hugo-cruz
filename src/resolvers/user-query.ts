import { getRepository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { User } from '../entities/user'
import { ID_NOT_FOUND, AUTHEN_ERROR } from '../errors';
import { APP_SECRET } from '../consts'

export default {

    Query: {
        
        async user (_, { id }, { request }){
            
            const token = request.headers.authorization

            try {
                jwt.verify(token, APP_SECRET);
            } catch(err) {
                throw new Error(AUTHEN_ERROR)
            }

            const user: User = await getRepository(User).findOne(id);

            if (user === undefined) {
                throw new Error(ID_NOT_FOUND)
            }
            
            return user;
        },
    },
}