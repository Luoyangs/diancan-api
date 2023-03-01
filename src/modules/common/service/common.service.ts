import { Inject, Provide } from '@midwayjs/decorator';
import * as svgCaptcha from 'svg-captcha';
import { isEmpty } from 'lodash';
import { BaseService } from '../../../core/base.service';
import { ImageCaptchaResult } from '../interface';
import { ImageCaptchaReqDto } from '../dto/common.dto';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { User } from '../entity/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { UserService } from './user.service';
import { Crypto, Jwt, StringUtil } from '../../../util';

@Provide()
export class CommonService extends BaseService<User> {
  @Inject()
  crypto: Crypto;

  @Inject()
  jwt: Jwt;

  @Inject()
  stringUtil: StringUtil;

  @InjectEntityModel(User)
  user: Repository<User>;

  @Inject()
  userService: UserService;

  /**
     * 生成图片验证码
     * 预览：https://www.bejson.com/ui/svg_editor/
     */
  async getImgCaptcha(
    captcha: ImageCaptchaReqDto
  ): Promise<ImageCaptchaResult> {
    const svg = svgCaptcha.create({
      size: 4,
      color: true,
      noise: 4,
      width: isEmpty(captcha.width) ? 100 : captcha.width,
      height: isEmpty(captcha.height) ? 50 : captcha.height,
    });
    const result = {
      img: `data:image/svg+xml;base64,${Buffer.from(svg.data).toString(
        'base64'
      )}`,
      id: this.stringUtil.generateUUID(),
    };
    // 10分钟过期时间
    await this.getAdminRedis().set(
      `admin:captcha:img:${result.id}`,
      svg.text,
      'EX',
      60 * 10
    );
    return result;
  }

  /**
   * 校验验证码
   */
  async checkImgCaptcha(id: string, code: string): Promise<boolean> {
    const result = await this.getAdminRedis().get(`admin:captcha:img:${id}`);
    if (isEmpty(result)) {
      return false;
    }
    if (code.toLowerCase() !== result.toLowerCase()) {
      return false;
    }
    // 校验成功后移除验证码
    await this.getAdminRedis().del(`admin:captcha:img:${id}`);
    return true;
  }

  /**
   * 获取登录JWT
   * 返回null则账号密码有误，不存在该用户
   */
  async getLoginSign(username: string, password: string): Promise<string> {
    const user = await this.user.findOne({
      username: username,
      status: 1,
    } as FindOneOptions<User>);
    if (isEmpty(user)) {
      return null;
    }
    const comparePassword = this.crypto.md5(`${password}${user.psalt}`);
    if (user.password !== comparePassword) {
      return null;
    }
    // const perms = await this.adminSysMenuService.getPerms(user!.id);
    const jwtSign = this.jwt.sign({
      uid: parseInt(user.id.toString()),
      pv: 1
    });
    await this.getAdminRedis().set(`admin:passwordVersion:${user.id}`, 1);
    await this.getAdminRedis().set(`admin:token:${user.id}`, jwtSign);
    // await this.getAdminRedis().set(
    //   `admin:perms:${user!.id}`,
    //   JSON.stringify(perms)
    // );
    // 保存登录日志
    // await this.adminSysLoginLogService.save(user!.id);
    return jwtSign;
  }
}
