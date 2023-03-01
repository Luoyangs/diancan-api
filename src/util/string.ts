import { Provide, Singleton, Config, Init } from '@midwayjs/core';
import { customAlphabet } from 'nanoid';
import * as FlakeIdGen from 'flake-idgen';
import * as intFormat from 'biguint-format';

@Provide()
@Singleton()
export class StringUtil {
  flakeIdGen: FlakeIdGen;

  @Config('flake')
  flakeConfig

  @Init()
  Init() {
    const { datacenter, worker } = this.flakeConfig;
    this.flakeIdGen = new FlakeIdGen({ datacenter, worker });
    console.log('datacenter, worker', datacenter, worker, this.generateUUID())
  }
  /**
   * 生成一个随机的值
   */
  generateRandomValue(
    length: number,
    placeholder = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
  ): string {
    const customNanoid = customAlphabet(placeholder, length);
    return customNanoid();
  }

  /**
   * Flake ID生成器在Node.js中的分布式环境中生成k有序、无冲突的ID
   */
  generateUUID(): number {
    return intFormat(this.flakeIdGen.next(), 'dec');
  }
}
