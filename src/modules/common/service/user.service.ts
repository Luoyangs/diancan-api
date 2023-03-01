import { Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { isEmpty } from 'lodash';
import { FindOneOptions, Repository, In, FindManyOptions } from 'typeorm';
import { BaseService } from '../../../core/base.service';
import { Crypto } from '../../../util/crypto';
import { StringUtil } from '../../../util/string';
import { BaseUserDto, CreateUserDto, UpdatePasswordDto } from '../dto/user.dto';
import { User } from '../entity/user.entity';
import { UserRole } from '../entity/user_role.entity';

const DEFAULT_PASSWORD = '123456';

@Provide()
export class UserService extends BaseService<User> {

  @InjectEntityModel(User)
  user: Repository<User>;

  @InjectEntityModel(UserRole)
  userRole: Repository<UserRole>;

  @Inject()
  crypto: Crypto;

  @Inject()
  stringUtil: StringUtil;

  /**
   * 获取系统用户信息
   * @param uid number
   * @returns
   */
  async getAccountInfo(uid: number): Promise<User | null> {
    const user: User | undefined = await this.user.findOne({ id: uid } as FindOneOptions<User>);
    if (!isEmpty(user)) {
      return {
        username: user.username,
        nickName: user.nickName,
        email: user.email,
        phone: user.phone,
        remark: user.remark,
        avatar: user.avatar,
      } as User;
    }
    return null;
  }

  /**
   * 查找用户信息
   * @param id 用户id
   */
  async info(
    id: number
  ): Promise<(User & { roles: number[] }) | never> {
    const user: any = await this.user.findOne({ id } as FindOneOptions<User>);
    if (isEmpty(user)) {
      throw new Error('not found this user info');
    }

    const roleRows = await this.userRole.find({ userId: id } as FindOneOptions<UserRole>);
    const roles = roleRows.map(e => {
      return e.roleId;
    });
    delete user.password;
    delete user.psalt;
    return { ...user, roles };
  }

  /**
   * 查找列表里的信息
   */
  async infoList(ids: number[]): Promise<User[]> {
    const users = await this.user.findBy({ id: In(ids) });
    return users.map(u => {
      delete u.password;
      return { ...u };
    });
  }

  /**
   * 查找列表里的信息
   */
  async allList(options?: FindManyOptions<User>): Promise<User[]> {
    const users = await this.user.find(options);
    return users.map(u => {
      delete u.password;
      return { ...u };
    });
  }

  /**
   * 增加系统用户，如果返回false则表示已存在该用户
   * @param param Object 对应SysUser实体类
   */
  async add(param: CreateUserDto): Promise<boolean> {
    const exists = await this.user.findOne({ username: param.username } as FindOneOptions<User>);
    if (!isEmpty(exists)) {
      return false;
    }
    // 所有用户初始密码为123456
    await this.dataSourceManager.transaction(async manager => {
      const id = this.stringUtil.generateUUID();
      const salt = this.stringUtil.generateRandomValue(32);
      const password = this.crypto.md5(`${DEFAULT_PASSWORD}${salt}`);
      const u = manager.create(User, {
        id,
        username: param.username,
        password,
        nickName: param.nickName,
        email: param.email,
        phone: param.phone,
        remark: param.remark,
        status: param.status,
        psalt: salt,
      });
      const result = await manager.save(u);
      const { roles } = param;
      const insertRoles = roles.map(e => {
        return {
          roleId: e,
          userId: result.id,
        };
      });
      // 分配角色
      await manager.insert(UserRole, insertRoles);
    });
    return true;
  }

  /**
   * 更新用户信息
   */
  async update(userId: number, param: BaseUserDto): Promise<void> {
    delete param.id;
    await this.dataSourceManager.transaction(async manager => {
      await manager.update(User, userId, param);
      // 先删除原来的角色关系
      await manager.delete(UserRole, { userId });
      const insertRoles = param.roles.map(e => {
        return {
          roleId: e,
          userId,
        };
      });
      // 重新分配角色
      await manager.insert(UserRole, insertRoles);
      if (param.status === 0) {
        // 禁用状态
        await this.forbidden(userId);
      }
    });
  }

  /**
   * 更改管理员密码
   */
  async updatePassword(uid: number, dto: UpdatePasswordDto): Promise<boolean> {
    const user = await this.user.findOne({ id: uid } as FindOneOptions<User>);
    if (isEmpty(user)) {
      throw new Error('update password user is not exist');
    }
    const defaultPassword = this.crypto.md5(`${DEFAULT_PASSWORD}${user.psalt}`);
    const comparePassword = this.crypto.md5(`${dto.originPassword}${user.psalt}`);

    if (user.password === defaultPassword || user.password === comparePassword) {
      const password = this.crypto.md5(`${dto.password}${user.psalt}`);
      await this.user.update({ id: uid }, { password });
      await this.upgradePasswordV(user.id);
    }

    // 原密码不一致，不允许更改
    return false;
  }

  /**
   * 禁用用户
   */
  async forbidden(uid: number): Promise<void> {
    await this.getAdminRedis().del(`admin:passwordVersion:${uid}`);
    await this.getAdminRedis().del(`admin:token:${uid}`);
    await this.getAdminRedis().del(`admin:perms:${uid}`);
  }

  /**
   * 升级用户版本密码
   */
  async upgradePasswordV(id: number): Promise<void> {
    // admin:passwordVersion:${param.id}
    const v = await this.getAdminRedis().get(`admin:passwordVersion:${id}`);
    if (!isEmpty(v)) {
      await this.getAdminRedis().set(
        `admin:passwordVersion:${id}`,
        parseInt(v!) + 1
      );
    }
  }
}
