import { Entity, Column, PrimaryColumn } from 'typeorm';
import { BaseEntity } from '../../../core/base.entity';

@Entity('sys_user')
export class User extends BaseEntity {

  @PrimaryColumn({ unique: true })
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ length: 32, comment: '密码盐值（随机生成，每个用户对应一个盐值）' })
  psalt: string;

  @Column({ name: 'nick_name', nullable: true })
  nickName: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  remark: string;

  @Column({ type: 'tinyint', nullable: true, default: 0, comment: '0: default active(未修改初始密码), 1: active, -1: inactive'})
  status: number;
}
