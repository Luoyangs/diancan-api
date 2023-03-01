import { ApiProperty } from "@midwayjs/swagger";
import { Rule, RuleType } from "@midwayjs/validate";
import { Expose } from "class-transformer";

export class ImageCaptchaReqDto {
  @ApiProperty({ example: 100, description: '验证码宽度' })
  @Rule(RuleType.number().integer())
  @Expose()
  width: number;

  @ApiProperty({ example: 50, description: '验证码高度' })
  @Rule(RuleType.number().integer())
  @Expose()
  height: number;
}

export class ImageCaptchaRespDto {
  @ApiProperty({ example: 'xxxx', description: '验证码编号' })
  id: string;

  @ApiProperty({ example: 'data:image/svg+xml;base64,xxx', description: '验证码图片' })
  img: number;
}

export class LoginInfoDto {
  @ApiProperty({ description: '管理员用户名', example: 'root' })
  @Rule(RuleType.string().required())
  @Expose()
  username: string;

  @ApiProperty({ description: '管理员密码', example: '123456' })
  @Rule(RuleType.string().required())
  @Expose()
  password: string;

  @ApiProperty({ description: '验证码标识ID', example: '0CRq2jthWUp7DiLCftB-P' })
  @Rule(RuleType.string().required())
  @Expose()
  captchaId: string;

  @ApiProperty({ description: '登录验证码', example: 'xfDp' })
  @Rule(RuleType.string().max(4).min(4).required())
  @Expose()
  verifyCode: string;
}

export class LoginRespDto {
  @ApiProperty({ example: 'xxxx', description: 'auth token' })
  token: string;
}
