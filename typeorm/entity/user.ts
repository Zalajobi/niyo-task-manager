import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Task} from "@typeorm/entity/task";
import {createUserRequestSchema} from "@schemas/usersSchemas";
import {z} from "zod";

@Entity()
export class User {
  constructor(data: z.infer<typeof createUserRequestSchema>) {
    this.email = data?.email;
    this.password = data?.password;
    this.first_name = data?.first_name;
    this.last_name = data?.last_name
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    unique: true
  })
  email: string;

  @Column({
    nullable: false,
  })
  password: string;

  @Column({
    nullable: false
  })
  first_name: string;

  @Column({
    nullable: false,
  })
  last_name: string;

  @CreateDateColumn()
  created_at: Date;

  // Relations
  @OneToMany(() => Task, task => task.creator)
  createdTasks: Task[];

  @OneToMany(() => Task, task => task.assignee)
  assignedTasks: Task[];
}