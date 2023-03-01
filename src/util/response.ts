import { ApiProperty, Type } from '@midwayjs/swagger';
import { ResOp } from '../interface';

/**
 * 统一错误代码定义
 */
export enum ErrorCode {
  PARAM_VALIDATE_EXCEPTION = 10000,
  SYSTEM_USER_EXIST = 10001,
  INPUT_CAPTCHA_ERROR = 10002,
  USERNAME_OR_PASSWORD_ERROR = 10003,
  SYSTEM_ROUTER_EXIST = 10004,
  PASSWORD_NOT_MATCH_ORIGINAL = 10011
}

export const ErrorMap = {
  // 10000 - 99999 业务操作错误
  [ErrorCode.PARAM_VALIDATE_EXCEPTION]: '参数校验异常',
  10001: '系统用户已存在',
  10002: '填写验证码有误',
  10003: '用户名密码有误',
  10004: '节点路由已存在',
  10005: '权限必须包含父节点',
  10006: '非法操作：该节点仅支持目录类型父节点',
  10007: '非法操作：节点类型无法直接转换',
  10008: '该角色存在关联用户，请先删除关联用户',
  10009: '该部门存在关联用户，请先删除关联用户',
  10010: '该部门存在关联角色，请先删除关联角色',
  10015: '该部门存在子部门，请先删除子部门',
  [ErrorCode.PASSWORD_NOT_MATCH_ORIGINAL]: '旧密码与原密码不一致',
  10012: '如想下线自身可右上角退出',
  10013: '不允许下线该用户',
  10014: '父级菜单不存在',
  10016: '系统内置功能，不可删除',

  // token相关
  11001: '登录无效或无权限访问',
  11002: '登录身份已过期',
  11003: '无权限，请联系管理员申请权限',

  // OSS相关
  20001: '当前创建的文件或目录已存在',
};

/**
 * 根据code获取错误信息
 */
export function getErrorMessageByCode(code: number): string {
  return ErrorMap[code];
}

export function res<T>(op?: ResOp<T>): ResOp<T> {
  return {
    data: op?.data ?? null,
    code: op?.code ?? 200,
    message: op?.code
      ? getErrorMessageByCode(op!.code) || op?.message || 'unknown error'
      : op?.message || 'success',
  };
}

export function SuccessWrapper<T extends Type>(ResourceCls: T, isArray: boolean = false) {
  class Successed {
    @ApiProperty({ description: '状态码' })
    code: number;

    @ApiProperty({ description: '消息', example: 'success' })
    message: string;

    @ApiProperty({
      type: ResourceCls,
      isArray,
      example: ResourceCls ?? null,
    })
    data: T;
  }

  return Successed;
}
