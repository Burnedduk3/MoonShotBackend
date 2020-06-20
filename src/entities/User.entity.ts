import { UserRole } from '@entities/UserRole.entity';
import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {Restaurant} from "@entities/Restaurant.entity";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  // Fields & Columns

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ nullable: false, unique: true })
  phone: string;

  @Field()
  @Column({ nullable: false, unique: true })
  userID: string;

  @Field()
  @Column({ default: '' })
  firstName: string;

  @Field()
  @Column({ default: '' })
  secondName: string;

  @Field()
  @Column({ default: '' })
  firstLastname: string;

  @Field()
  @Column({ default: '' })
  secondLastname: string;

  @Field()
  @Column({ nullable: true })
  confirmationCode: number;

  @Column('bool', { default: false })
  confirmed: boolean;

  @Column('int', { default: 0 })
  tokenVersion: number;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createAt: Date;

  // Relations

  // ManyToOne
  @Field(() => UserRole, { nullable: false })
  @ManyToOne(() => UserRole, (userRole) => userRole.users)
  role: UserRole;

  // OneToMany
  @Field(() => [Restaurant], { nullable: true })
  @OneToMany(() => Restaurant, (restaurant) => restaurant.owner)
  restaurants: Restaurant[];

}
