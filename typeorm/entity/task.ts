import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {TaskPriorityEnum, TaskStatusEnum} from "@typeorm/entity/enum";
import {User} from "@typeorm/entity/user";
import {z} from "zod";
import {createTaskRequestSchema} from "@schemas/taskSchemas";

@Entity()
export class Task {
  constructor(data: z.infer<typeof createTaskRequestSchema>) {
    this.title = data?.title;
    this.description = data?.description;
    this.due_date = new Date(data?.due_date);
    this.priority = data?.priority as TaskPriorityEnum;
    this.status = data?.status as TaskStatusEnum;
    this.assigneeId = data?.assigneeId as string;
    this.creatorId = data?.creatorId ?? '';
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
  })
  assigneeId: string

  @Column({
    nullable: false,
  })
  creatorId: string

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