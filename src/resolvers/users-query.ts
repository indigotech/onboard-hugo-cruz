import { getRepository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { User } from '../entities/user'
import { AUTHEN_ERROR } from '../errors';
import { APP_SECRET } from '../consts'

export default {

    Query: {
        
        async users (_, { limit = 10, offset = 0 }, { request }){
            
            const token = request.headers.authorization
            
            try {
                jwt.verify(token, APP_SECRET);
            } catch(err) {
                throw new Error(AUTHEN_ERROR)
            }
            
            const [users, total] = await getRepository(User).findAndCount(({ order: { name: 'ASC' }, take: limit, skip: offset }))
            
            const info = { 
                before: offset > 0, 
                after: total - (limit + offset) > 0 };

            console.log(users)
            console.log(total)
            console.log(info)

            return { users, total, info }

        },
    },
}