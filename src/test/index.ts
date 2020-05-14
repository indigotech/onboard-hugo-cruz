import { Connection } from 'typeorm';
import { configServer } from '../config'
import { startServer } from '../server'; 

let dbConnection: Connection;

before(async () => {
    dbConnection = await configServer();
    startServer();
});

require('./login.test');

after( async () => {
    await dbConnection.close();
});