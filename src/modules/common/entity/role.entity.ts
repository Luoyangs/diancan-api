import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../core/base.entity';

@Entity('sys_role')
export class Role extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '创建人'})
  userId: string;

  @Column({ unique: true, comment: '名称' })
  name: string;

  @Column({ length: 50, unique: true, comment: '标签' })
  label: string;

  @Column({ nullable: true, comment: '备注' })
  remark: string;
}
