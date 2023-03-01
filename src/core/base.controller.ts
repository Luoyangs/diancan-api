import { App, Inject } from '@midwayjs/decorator';
import { Application, Context } from '@midwayjs/koa';
import { ResOp } from '../interface';
import { res} from '../util';

export const ADMIN_PREFIX_URL = '/admin';
// 无需权限URL前缀
export const NOPERM_PREFIX_URL = '/common';
// 无需校验TOKEN的URL
export const NOAUTH_PREFIX_URL = '/public';

export abstract class BaseController {
  @App()
  protected app: Application;

  @Inject()
  protected ctx: Context;

  public res<T>(op?: ResOp<T>): ResOp<T> {
    return res(op);
  }
}
