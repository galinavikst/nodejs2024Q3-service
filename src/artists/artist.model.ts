import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Artist {
  @PrimaryColumn({ nullable: false })
  id: string; // uuid v4

  @Column()
  name: string;

  @Column()
  grammy?: boolean;
}
