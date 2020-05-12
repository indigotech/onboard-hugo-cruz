import * as dotenv from 'dotenv';
import path from 'path';
import {createConnection, Connection } from 'typeorm';

export function configServer(): Promise<Connection> {
    const isTestMode: boolean = process.env.TEST === 'true';
    const envFileName = isTestMode ? '.env.test' : '.env';
    dotenv.config({ path: path.join(__dirname, '..', envFileName) });
    return createConnection();
}