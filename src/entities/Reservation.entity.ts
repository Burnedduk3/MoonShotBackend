import { Restaurant } from '@entities/Restaurant.entity';
import { User } from '@entities/User.entity';
import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as uniqid from 'uniqid';
import {Companion} from "@entities/Companion.entity";

@ObjectType()
@Entity()
export class Reservation extends BaseEntity {
  // Fields & Columns

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ nullable: false })
  reservationIdentifier: string;

  @Field()
  @Column({ nullable: false })
  peopleQuantities: number;

  @Field()
  @Column({ nullable: false, default: true })
  active: boolean;

  @Field()
  @Column({ nullable: false })
  reservationTime: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createAt: Date;

  // Relations

  // OneToMany
  @Field(() => Restaurant, { nullable: true })
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.owner)
  restaurant: Restaurant;

  // ManyToOne
  @Field(() => User, { nullable: false })
  @ManyToOne(() => User, (user) => user.reservations)
  owner: User;

  // OneToMany
  @Field(() => [Companion], { nullable: true })
  @OneToMany(() => Companion, (companion) => companion.reservation)
  companions: Companion[];

  // Before Insert
  // Before insertion
  @BeforeInsert()
  async assignId() {
    const randomNum = Math.floor(Math.random() * 9);
    this.reservationIdentifier = uniqid.time('', randomNum.toString());
  }
}
