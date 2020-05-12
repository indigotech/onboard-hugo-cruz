import { Connection } from 'typeorm';
import { configServer } from '../config'

let dbConnection: Connection;

before(async () => {
    dbConnection = await configServer();
});

require('./User.test');

after( async () => {
    await dbConnection.close();
});