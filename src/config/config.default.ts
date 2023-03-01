import { MidwayConfig } from '@midwayjs/core';
import * as redisStore from 'cache-manager-ioredis';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1676528084999_7205',
  koa: {
    port: 7001,
  },
  flake: { // https://github.com/T-PWK/flake-idgen
    datacenter: 1, // datacenter identifier. It can have values from 0 to 31.
    worker: 1  // worker identifier. It can have values from 0 to 31
  },
  jwt: {
    secret: 'INnyQ50BEE6AITQraIaDGooJ',
    signOptions: { expiresIn: 1000 * 60 * 60 * 24 },
    verifyOptions: { complete: true },
  },
  typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        host: '127.0.0.1',      // 改成你的mysql数据库IP
        port: 3306,             // 改成你的mysql数据库端口
        username: 'root',       // 改成你的mysql数据库用户名（需要有创建表结构权限）
        password: 'root',       // 改成你的mysql数据库密码
        database: 'diancan-db',// 改成你的mysql数据库IP
        synchronize: true,      // 如果第一次使用，不存在表，有同步的需求可以写 true
        logging: true,
        entities: [
          '**/*.entity{.ts,.js}'
        ]
      }
    }
  },
  cache: { // midway cache
    // store: require('cache-manager-ioredis'),
    store: redisStore,
    options: {
      host: process.env.REDIS_HOST || '127.0.0.1', // default value
      port: parseInt(process.env.REDIS_PORT) || 6379, // default value
      db: 0,
      ttl: 60,
    },
  },
} as MidwayConfig;
