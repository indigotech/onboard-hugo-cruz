import { Connection } from 'typeorm';
import { configServer } from '../config'

let dbConnection: Connection;

before(async () => {
    dbConnection = await configServer();
});

require('./user.test');

after( async () => {
    await dbConnection.close();
});