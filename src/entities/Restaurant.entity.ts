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
import { Recipes } from './Recipes.entity';

@ObjectType()
@Entity()
export class Restaurant extends BaseEntity {
  // Fields & Columns

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ nullable: false })
  name: string;

  @Field()
  @Column({ nullable: false,  })
  address: string;

  @Field()
  @Column({ nullable: false })
  phoneNumber: string;

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
}
