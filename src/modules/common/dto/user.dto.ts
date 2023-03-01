import { Rule, RuleType } from '@midwayjs/validate';
import { ApiProperty } from '@midwayjs/swagger';
import { Expose } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({ description: '管理员登录账号', example: 'admin' })
  @Rule(
    RuleType.string()
      .min(6)
      .max(20)
      .pattern(/^[a-z0-9A-Z]+$/)
      .required()
  )
  @Expose()
  username: string;

  @ApiProperty({ description: '管理员别名', example: 'alias' })
  @Rule(RuleType.string().empty('').optional())
  @Expose()
  nickName: string;

  @Rule(RuleType.array().items(RuleType.number()).min(1).max(3).required())
  @Expose()
  roles: number[];

  @ApiProperty({ description: '备注', example: 'remark' })
  @Rule(RuleType.string().empty('').optional())
  @Expose()
  remark: string;

  @ApiProperty({ description: '邮箱', example: 'xx@qq.com' })
  @Rule(RuleType.string().empty('').email().optional())
  @Expose()
  email: string;

  @ApiProperty({ description: '手机号码', example: '123244224332' })
  @Rule(RuleType.string().empty('').optional())
  @Expose()
  phone: string;

  @ApiProperty({ description: '状态是否可用', example: 0 })
  @Rule(RuleType.number().integer().valid(0, 1).optional())
  @Expose()
  status: number;
}

export class BaseUserDto extends CreateUserDto {
  @ApiProperty({ description: '管理员ID' })
  @Rule(RuleType.number().integer().required())
  @Expose()
  id: number;

  @ApiProperty({ description: '头像', example: 'http://www.midwayjs.org/img/logo.svg' })
  @Rule(RuleType.string().empty('').optional())
  @Expose()
  avatar: string;
}

export class InfoUserDto {
  @ApiProperty({ description: '管理员ID' })
  @Rule(RuleType.number().integer().required())
  @Expose()
  id: number;
}

export class UpdatePasswordDto {
  @ApiProperty({ description: '原密码', example: 'xxxx' })
  @Rule(RuleType.string().min(6))
  originPassword: string;

  @ApiProperty({ description: '新密码', example: 'xxxxx' })
  @Rule(
    RuleType.string()
      .min(6)
      .pattern(/^[a-z0-9A-Z`~!#%^&*=+\\|{};:'\\",<>/?]+$/)
      .required()
  )
  password: string;
}
