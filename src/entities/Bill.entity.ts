import { Restaurant } from '@entities/Restaurant.entity';
import { User } from '@entities/User.entity';
import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Bill extends BaseEntity {
  // Fields & Columns

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ nullable: false })
  name: string;

  @Field()
  @Column({ nullable: false, default: 0 })
  totalPrice: number;

  @Field()
  @Column({ nullable: false })
  description: string;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createAt: Date;

  // Relations
  @Field(() => User, { nullable: false })
  @ManyToOne(() => User, (bill) => bill.bills)
  userOwner: User;

  @Field(() => Restaurant, { nullable: false })
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.bills)
  restaurant: Restaurant;

  // // Many to many
  // @Field(() => [Recipes], { nullable: false })
  // @ManyToMany((_type) => Recipes, (recipe) => recipe.bills)
  // @JoinTable()
  // billRecipes: Recipes[];
}
