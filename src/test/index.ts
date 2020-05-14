import { Connection } from 'typeorm';
import { configServer } from '../config'

let dbConnection: Connection;

before(async () => {
    dbConnection = await configServer();
});

require('./login.test');

after( async () => {
    await dbConnection.close();
});