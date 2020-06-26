import { Restaurant } from '@entities/Restaurant.entity';
import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as uniqid from 'uniqid';

@ObjectType()
@Entity()
export class Recipes extends BaseEntity {
  // Fields & Columns

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ nullable: false })
  name: string;

  @Field()
  @Column({ nullable: false, unique: true })
  recipeIdentifier: string;

  @Field()
  @Column({ nullable: false, default: 0 })
  price: number;

  @Field()
  @Column({ nullable: false })
  description: string;

  @Field()
  @Column({ default: false })
  recipeCategory: string;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createAt: Date;

  // Relations

  // ManyToOne
  @Field(() => Restaurant, { nullable: false })
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.recipes)
  restaurantMenu: Restaurant;

  // Before insertion
  @BeforeInsert()
  async assignId() {
    const randomNum = Math.floor(Math.random() * 1000);
    this.recipeIdentifier = uniqid.process('reci', randomNum.toString());
  }
}
