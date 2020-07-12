import { CONFIG_BCRYPT_SALT_ROUNDS } from '@config/variables';
import { Restaurant } from '@entities/Restaurant.entity';
import { UserRole } from '@entities/UserRole.entity';
import * as bcrypt from 'bcrypt';
import { IsEmail, MinLength } from 'class-validator';
import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany, OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Reservation } from './Reservation.entity';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  // Fields & Columns

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ nullable: false, unique: true })
  userID: string;

  @Field()
  @Column({ nullable: false, unique: true })
  phone: string;

  @Field()
  @Column({ nullable: false, unique: true })
  username: string;

  @Field()
  @Column({ nullable: false })
  @MinLength(8, { message: 'Less than 8' })
  password: string;

  @Field()
  @Column({ nullable: false, unique: true })
  @IsEmail()
  email: string;

  @Field()
  @Column({ nullable: false })
  firstName: string;

  @Field()
  @Column({ default: '' })
  secondName: string;

  @Field()
  @Column({ nullable: false })
  firstLastname: string;

  @Field()
  @Column({ default: '' })
  secondLastname: string;

  @Field()
  @Column({ nullable: true })
  confirmationCode: number;

  @Field()
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
  @Field(() => Restaurant, { nullable: true })
  @OneToOne(() => Restaurant, (restaurant) => restaurant.owner)
  restaurant: Restaurant;

  // OneToMany
  @Field(() => [Reservation], { nullable: true })
  @OneToMany(() => Reservation, (reservation) => reservation.owner)
  reservations: Reservation[];

  // Before insertion
  @BeforeInsert()
  async encryptPassword() {
    this.password = await bcrypt.hash(this.password, CONFIG_BCRYPT_SALT_ROUNDS ? CONFIG_BCRYPT_SALT_ROUNDS : 10);
  }
}
