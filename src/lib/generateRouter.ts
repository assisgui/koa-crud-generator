import * as koaRouter from 'koa-joi-router'
import { HandlersFactory } from './handlers'
import { defaultOptions, TGenerateRouter } from './types'
import { merge, cloneDeep } from 'lodash'
import { Context } from 'koa'
import { Joi } from "koa-joi-router";

export const generateRouter = (options: TGenerateRouter[]) => {
  const router = koaRouter()
  options.map((option) => {
    const {
      endpoints: {
        getAll,
        search,
        getOne,
        post,
        put,
        delete: deleteMethod
      },
      basePath
    } = cloneDeep(merge(defaultOptions, option))

    const handler = new HandlersFactory(option.entity)

    !!getAll?.enabled && router.route({
      method: 'get',
      path: `/${basePath ? basePath : option.entity.name.toLocaleLowerCase()}`,
      validate: merge(
        getAll.pagination.enabled && {
          query: {
            page: Joi.number().min(1),
            limit: Joi.number()
              .min(getAll.pagination.limitMin)
              .max(getAll.pagination.limitMax)
          }
        },
        getAll.dto,
      ),
      pre: getAll.pre,
      handler: getAll?.overrideHandler
        ? [...(getAll.extraHandlers || []), getAll.overrideHandler] :
        [
          ...(getAll.extraHandlers || []),
          async (ctx: Context) => { ctx.body = await handler.getAll({
            page: Number(ctx.request.query.page || getAll.pagination.page),
            limit: Number(ctx.request.query.limit || getAll.pagination.limit),
            hasPagination: getAll.pagination.enabled,
            relations: getAll.relations
          })}
        ]
    })

    !!search?.enabled && router.route({
      method: 'post',
      path: `/${basePath ? basePath : option.entity.name.toLocaleLowerCase()}/search`,
      validate: search.dto,
      pre: search.pre,
      handler: search?.overrideHandler
        ? [...(search.extraHandlers || []), search.overrideHandler] :
        [
          ...(search.extraHandlers || []),
          async (ctx: Context) => { ctx.body = await handler.search({
            filters: ctx.request.body,
            page: Number(ctx.request.query.page || search.pagination.page),
            limit: Number(ctx.request.query.limit || search.pagination.limit),
            hasPagination: search.pagination.enabled,
            relations: search.relations
          })}
        ]
    })

    !!getOne?.enabled && router.route({
      method: 'get',
      path: `/${basePath ? basePath : option.entity.name.toLocaleLowerCase()}/:id`,
      validate: {
        params: {
          id: Joi.number().required()
        },
        ...getOne.dto
      },
      pre: getOne.pre,
      handler: getOne?.overrideHandler
        ? [...(getOne.extraHandlers || []), getOne.overrideHandler] :
        [
          ...(getOne.extraHandlers || []),
          async (ctx: Context) => { ctx.body = await handler.getOne({ id: ctx.params.id, relations: getOne.relations }) }
        ]
    })

    !!post?.enabled && router.route({
      method: 'post',
      path: `/${basePath ? basePath : option.entity.name.toLocaleLowerCase()}`,
      validate: post.dto,
      pre: post.pre,
      handler: post?.overrideHandler
        ? [...(post.extraHandlers || []), post.overrideHandler] :
        [
          ...(post.extraHandlers || []),
          async (ctx: Context) => { ctx.body = await handler.create({ data : ctx.request.body })}
        ]
    })

    !!put?.enabled && router.route({
      method: 'put',
      path: `/${basePath ? basePath : option.entity.name.toLocaleLowerCase()}/:id`,
      validate: {
        params: {
          id: Joi.number().required()
        },
        ...put.dto
      },
      pre: put.pre,
      handler: put?.overrideHandler
        ? [...(put.extraHandlers || []), put.overrideHandler] :
        [
          ...(put.extraHandlers || []),
          async (ctx: Context) => { ctx.body = await handler.update({ id: ctx.params.id, data: ctx.request.body })}
        ]
    })

    !!deleteMethod?.enabled && router.route({
      method: 'delete',
      path: `/${basePath ? basePath : option.entity.name.toLocaleLowerCase()}/:id`,
      validate: deleteMethod.dto,
      pre: deleteMethod.pre,
      handler: deleteMethod?.overrideHandler
        ? [...(deleteMethod.extraHandlers || []), deleteMethod.overrideHandler] :
        [
          ...(deleteMethod.extraHandlers || []),
          async (ctx: Context) => { ctx.body = await handler.delete({ id: ctx.params.id })}
        ]
    })

    return router
  })

  return router.middleware()
}
