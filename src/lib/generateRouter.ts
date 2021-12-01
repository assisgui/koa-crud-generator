import * as koaRouter from 'koa-joi-router'
import { HandlersFactory } from './handlers'
import { defaultOptions, TGenerateRouter } from './types'
import { merge } from 'lodash'
import { Context } from 'koa'
import {Joi} from "koa-joi-router";

export const generateRouter = (options: TGenerateRouter[]) => {
  const router = koaRouter()
  options.map((option) => {
    const { methods: {
      getAll, getOne, post, put, delete: deleteMethod
    }, basePath } = merge(defaultOptions, option)

    router.prefix(`/${basePath ? basePath : option.entity.name}`)
    const handler = new HandlersFactory(option.entity)

    !!getAll?.enabled && router.route({
      method: 'get',
      path: '/',
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
          async (ctx: Context) => { ctx.body = await handler.getAll(
            {},
            Number(ctx.request.query.page || getAll.pagination.page),
            Number(ctx.request.query.limit || getAll.pagination.limit),
            getAll.pagination.enabled
          )}
        ]
    })

    !!getOne?.enabled && router.route({
      method: 'get',
      path: '/:id',
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
          async (ctx: Context) => { ctx.body = await handler.getOne(ctx.params.id) }
        ]
    })

    !!post?.enabled && router.route({
      method: 'post',
      path: '/',
      validate: post.dto,
      pre: post.pre,
      handler: post?.overrideHandler
        ? [...(post.extraHandlers || []), post.overrideHandler] :
        [
          ...(post.extraHandlers || []),
          async (ctx: Context) => { ctx.body = await handler.create(ctx.request.body)}
        ]
    })

    !!put?.enabled && router.route({
      method: 'put',
      path: '/:id',
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
          async (ctx: Context) => { ctx.body = await handler.update(ctx.params.id, ctx.request.body)}
        ]
    })

    !!deleteMethod?.enabled && router.route({
      method: 'delete',
      path: '/:id',
      validate: deleteMethod.dto,
      pre: deleteMethod.pre,
      handler: deleteMethod?.overrideHandler
        ? [...(deleteMethod.extraHandlers || []), deleteMethod.overrideHandler] :
        [
          ...(deleteMethod.extraHandlers || []),
          async (ctx: Context) => { ctx.body = await handler.delete(ctx.params.id)}
        ]
    })

    return router
  })

  return router.middleware()
}
