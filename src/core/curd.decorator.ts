import { Controller, Del, Get, Post, Put } from '@midwayjs/decorator';
import { ApiBody, ApiParam, ApiProperty, ApiQuery } from '@midwayjs/swagger';

class BaseDto {
  @ApiProperty()
  public select: unknown;

  @ApiProperty()
  public include: unknown;

  @ApiProperty()
  public sort: unknown;

  @ApiProperty()
  public page: number;

  @ApiProperty()
  public limit: number;
}

export const Crud = (prefix, routerOptions, crudOptions): ClassDecorator => {
  const decorators = {
    index: [
      Get('/', { summary: '列表' }),
      ApiQuery({ type: crudOptions.dto?.index || BaseDto }),
    ],
    show: [
      Get('/:id', { summary: '详情' }),
      ApiParam({ name: 'id', type: 'string', required: true }),
      ApiQuery({ type: crudOptions.dto?.show || BaseDto }),
    ],
    create: [
      Post('/', { summary: '新建' }),
      ApiBody({ type: crudOptions.dto?.create }),
    ],
    update: [
      Put('/:id', { summary: '更新' }),
      ApiParam({ name: 'id', type: 'string', required: true }),
      ApiBody({ type: crudOptions.dto?.update }),
    ],
    destroy: [
      Del('/:id', { summary: '删除' }),
      ApiParam({ name: 'id', type: 'string', required: true })
    ],
  };

  return (target) => {
    for (const propertyKey of crudOptions.apis) {
      Reflect.decorate(decorators[propertyKey], target, propertyKey);
    }
    Controller(prefix || '/', routerOptions)(target);
  };
};
