import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, Unique } from 'typeorm'

var crypto = require('crypto')

@Entity()
@Unique(["email"])
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  birthDate: string

  @Column()
  cpf: string

  @Column()
  password: string

  @BeforeInsert()
  hashpassword(){
    crypto.createHash('md5').update(this.password).digest("hex");
  }
}