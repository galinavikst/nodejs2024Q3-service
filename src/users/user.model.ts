import { BigIntToNumberTransformer } from 'src/transformers';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  id: string; // uuid v4

  @Column()
  login: string;

  @Column()
  password: string;

  @Column()
  version: number; // integer number, increments on update

  @Column({ type: 'bigint', transformer: BigIntToNumberTransformer })
  createdAt: number; // 1731494623551 timestamp of creation

  @Column({ type: 'bigint', transformer: BigIntToNumberTransformer })
  updatedAt: number; // timestamp of last update
}
