import {Column, CreateDateColumn, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Task} from "@typeorm/entity/task";

export class User {

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