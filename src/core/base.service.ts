import { CacheManager } from '@midwayjs/cache';
import { App, Inject } from '@midwayjs/decorator';
import { Application, Context } from '@midwayjs/koa';
import { InjectDataSource } from '@midwayjs/typeorm';
import { DataSource } from 'typeorm';
import Redis from 'ioredis';

export abstract class BaseService<T> {
  @App()
  protected app: Application;

  @Inject()
  protected ctx: Context;

  @Inject('cache:cacheManager')
  cacheManager: CacheManager;

  @InjectDataSource('default')
  dataSourceManager: DataSource;

  getAdminRedis(): Redis {
    return (this.cacheManager.cache.store as any).getClient();
  }

  getAdminCacheManager(): CacheManager {
    return this.cacheManager;
  }
}
