import { User } from '@entities/User.entity';
import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as uniqid from 'uniqid';
import { Recipes } from './Recipes.entity';
import {Reservation} from "@entities/Reservation.entity";

@ObjectType()
@Entity()
export class Restaurant extends BaseEntity {
  // Fields & Columns

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ nullable: false, unique: true })
  restaurantIdentifier: string;

  @Field()
  @Column({ nullable: false })
  name: string;

  @Field()
  @Column({ nullable: false })
  address: string;

  @Field()
  @Column({ nullable: false, default:"" })
  phoneNumber: string;

  @Field()
  @Column({ nullable: false, default: 0 })
  capacity: number;

  @Field()
  @Column({ nullable: false, default: 0 })
  maxCapacity: number;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createAt: Date;

  // Relations

  // ManyToOne
  @Field(() => User, { nullable: false })
  @ManyToOne(() => User, (user) => user.restaurants)
  owner: User;

  // OneToMany
  @Field(() => [Recipes], { nullable: true })
  @OneToMany(() => Recipes, (recipe) => recipe.restaurantMenu)
  recipes: Recipes[];

  // OneToMany
  @Field(() => [Reservation], { nullable: true })
  @OneToMany(() => Reservation, (reservations) => reservations.restaurant)
  reservations: Reservation[];

  // Before insertion
  @BeforeInsert()
  async assignId() {
    const randomNum = Math.floor(Math.random() * 100);
    this.restaurantIdentifier = uniqid.process(randomNum.toString());
  }
}
