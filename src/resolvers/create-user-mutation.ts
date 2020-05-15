import { getRepository } from 'typeorm';
import { User } from '../entities/user'
import {EMAIL_DUPLICATED, PASSW_DIGIT, PASSW_LETTERS, PASSW_SHORT, AUTHEN_ERROR} from '../errors';
import {APP_SECRET} from '../consts'

var jwt = require('jsonwebtoken');

export default {

  Mutation: {

    createUser: async (_, { data }, { request } ) => {

      const token = request.headers.authorization

      try {
        jwt.verify(token, APP_SECRET);
      } catch(err) {
        throw new Error(AUTHEN_ERROR)
      }

      const user: User = await getRepository(User).findOne({email: data.email});
      if (user) {
        throw new Error (EMAIL_DUPLICATED)
      }

      const digits = data.password.match(/\d/);
      if (!digits?.length) {
        throw new Error(PASSW_DIGIT)   
      }

      const letters = data.password.match(/\D/);
      if (!letters?.length) {
        throw new Error(PASSW_LETTERS)
      }

      const size = data.password.length
      if (size < 7) {
        throw new Error(PASSW_SHORT)
      }

      return user 
 
    }
  }
}
