import{ createConnection } from 'typeorm';

export function configServer(){
    createConnection();
}