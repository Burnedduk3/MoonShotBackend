import { Reservation } from '@entities/Reservation.entity';
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
export class Companion extends BaseEntity {
  // Fields & Columns

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ nullable: false })
  userID: string;

  @Field()
  @Column({ nullable: false })
  phone: string;

  @Field()
  @Column({ nullable: false })
  completeName: string;

  @Field()
  @Column({ nullable: false })
  address: string;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createAt: Date;

  // Relations
  @Field(() => Reservation, { nullable: false })
  @ManyToOne(() => Reservation, (reservation) => reservation.companions)
  reservation: Reservation;
}
