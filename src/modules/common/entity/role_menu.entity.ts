import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../core/base.entity';

@Entity('sys_role_menu')
export class RoleMenu extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'role_id' })
  roleId: number;

  @Column({ name: 'menu_id' })
  menuId: number;
}
