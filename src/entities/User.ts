import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';

import { hashPassword } from '../hash-password';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ unique: true })
  email: string

  @Column()
  birthDate: string

  @Column()
  cpf: string

  @Column()
  password: string

  @BeforeInsert()
  hashpassword(){
    hashPassword(this.password);
  }
}