import { Config, Provide, Singleton } from '@midwayjs/decorator';
import * as jwt from 'jsonwebtoken';

@Provide()
@Singleton()
export class Jwt {
  @Config('jwt')
  private jwtConfig;

  public sign(payload: string | Record<string, unknown>, options?: jwt.SignOptions) {
    const opts = Object.assign(this.jwtConfig.signOptions, options);
    return jwt.sign(payload, this.jwtConfig.secret, opts);
  }

  public verify(token: string, options?: jwt.VerifyOptions) {
    const opts = Object.assign(this.jwtConfig.verifyOptions, options);
    const { payload } = jwt.verify(token, this.jwtConfig.secret, opts) as { payload: jwt.JwtPayload | string };
    return payload;
  }
}
