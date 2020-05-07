import { Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Course {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "text" })
    titles: string;

    @Column({ type: "text" })
    caption: string;

    @Column({ type: "text" })
    about: string;
}