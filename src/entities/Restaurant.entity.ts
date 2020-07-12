import { Reservation } from '@entities/Reservation.entity';
import { User } from '@entities/User.entity';
import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  BeforeInsert, BeforeUpdate,
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
  @Column({ nullable: false, default: '' })
  phoneNumber: string;

  @Field()
  @Column({ nullable: false, default: 0 })
  reservationCapacity: number;

  @Field()
  @Column({ nullable: false, default: 0 })
  locationCapacity: number;

  @Field()
  @Column({ nullable: false, default: 0 })
  capacity: number;

  @Field()
  @Column({ nullable: false, default: false })
  warning: boolean;

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
  @ManyToOne(() => User, (user) => user.restaurant)
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
    const randomNum = Math.floor(Math.random() * 1000);
    this.restaurantIdentifier = uniqid.process('rest', randomNum.toString());
  }

  @BeforeUpdate()
  async calculateCapacity() {
    this.capacity = this.locationCapacity + this.reservationCapacity;
    if(this.capacity > this.maxCapacity){
      this.warning = true;
    }else{
      this.warning = false;
    }
  }
}
