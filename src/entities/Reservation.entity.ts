import { Restaurant } from '@entities/Restaurant.entity';
import { User } from '@entities/User.entity';
import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Reservation extends BaseEntity {
  // Fields & Columns

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ nullable: false })
  peopleQuantities: number;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createAt: Date;

  // Relations

  // OneToMany
  @Field(() => Restaurant, { nullable: true })
  @OneToMany(() => Restaurant, (restaurant) => restaurant.owner)
  restaurant: Restaurant;

  // ManyToOne
  @Field(() => User, { nullable: false })
  @ManyToOne(() => User, (user) => user.restaurants)
  owner: User;
}
