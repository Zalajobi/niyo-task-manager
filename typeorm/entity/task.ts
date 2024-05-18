import {Column, CreateDateColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {TaskPriorityEnum, TaskStatusEnum} from "@typeorm/entity/enum";
import {User} from "@typeorm/entity/user";

export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  title: string;

  @Column({
    nullable: false,
  })
  description: string;

  @Column({
    nullable: false,
  })
  due_date: Date;

  @Column({
    type: 'enum',
    enum: TaskPriorityEnum,
    nullable: false,
  })
  priority: TaskPriorityEnum;

  @Column({
    type: 'enum',
    enum: TaskStatusEnum,
    nullable: false,
  })
  status: TaskStatusEnum;

  @CreateDateColumn()
  created_at: Date;

  // Relations
  @ManyToOne(() => User, user => user.assignedTasks, {
    nullable: true,
  })
  assignee: User;

  @ManyToOne(() => User, user => user.createdTasks, {
    nullable: false
  })
  creator: User;
}