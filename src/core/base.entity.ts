import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @CreateDateColumn()
  ctime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
