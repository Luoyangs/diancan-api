import { Inject, Post, Body, ALL, Controller, Get } from '@midwayjs/decorator';
import { Validate } from '@midwayjs/validate';
import { ResOp } from '../../../interface';
import { ErrorCode } from '../../../util';
import { ADMIN_PREFIX_URL, BaseController } from '../../../core/base.controller';
import { UserService } from '../service/user.service';
import { BaseUserDto, CreateUserDto, UpdatePasswordDto } from '../dto/user.dto';
import { ApiBody, ApiResponse } from '@midwayjs/swagger';
import { User } from '../entity/user.entity';
import { ListUser, ViewDone, ViewUser } from '../interface';

@Controller(`${ADMIN_PREFIX_URL}/user`)
export class UserController extends BaseController {

  @Inject()
  userService: UserService;

  @ApiResponse({
    status: 200,
    type: ListUser
  })
  @Get('/list', { summary: '获取管理员列表' })
  async list(): Promise<ResOp<User[]>> {
    return this.res({
      data: await this.userService.allList(),
    });
  }

  @ApiResponse({
    status: 200,
    type: ViewUser
  })
  @Get('/info', { summary: '获取管理员资料' })
  async info(): Promise<ResOp<User>> {
    return this.res({
      data: await this.userService.getAccountInfo(this.ctx.admin.uid),
    });
  }


  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 200,
    type: ViewDone
  })
  @Post('/add', { summary: '新增系统管理员' })
  @Validate()
  async add(@Body(ALL) dto: CreateUserDto): Promise<ResOp<User>> {
    const result = await this.userService.add(dto);
    if (!result) {
      return this.res({ code: ErrorCode.SYSTEM_USER_EXIST });
    }
    return this.res();
  }

  @ApiResponse({
    status: 200,
    type: ViewDone
  })
  @Post('/update', { summary: '更新系统管理员'})
  @Validate()
  async update(@Body(ALL) dto: BaseUserDto): Promise<ResOp<User>> {
    await this.userService.update(dto.id, dto);
    // await this.adminSysMenuService.refreshPerms(dto.id);
    return this.res();
  }

  @ApiResponse({
    status: 200,
    type: ViewDone
  })
  @Post('/password', { summary: '更改管理员密码'})
  @Validate()
  async updatePassword(@Body(ALL) dto: UpdatePasswordDto): Promise<ResOp<User>> {
    const result = await this.userService.updatePassword(
      this.ctx.admin.uid,
      dto
    );
    if (result) {
      return this.res();
    }
    return this.res({ code: ErrorCode.PASSWORD_NOT_MATCH_ORIGINAL });
  }
}
