import * as koaRouter from 'koa-joi-router'
import {HandlersFactory} from "./handlers";
import {defaultOptions, TGenerateRouter} from "./types";
import {EntityTarget} from "typeorm/common/EntityTarget";

export const generateRouter = (options: TGenerateRouter[]) => {
  const router = koaRouter()
  options.map((option) => {
    const { methods: {
      getAll, getOne, post, put, delete: deleteMethod
    }, basePath } = { ...defaultOptions, ...option }

    router.prefix(`/${basePath ? basePath : option.entity.name}`)
    const handler = new HandlersFactory(option.entity)

    !!getAll?.enabled && router.get('/', getAll?.overrideHandler
      ? [...(getAll.extraHandlers || []), getAll.overrideHandler] :
      [
        ...(getAll.extraHandlers || []),
        async (ctx: any) => { ctx.body = await handler.getAll({}, ctx.query.page, ctx.query.pageSize, true)}
      ]
    )

    !!getOne?.enabled && router.get('/:id', getOne?.overrideHandler
      ? [...(getOne.extraHandlers || []), getOne.overrideHandler] :
      [
        ...(getOne.extraHandlers || []),
        async (ctx: any) => { ctx.body = await handler.getOne(ctx.params.id) },
      ]
    )

    !!post?.enabled && router.post('/', post?.overrideHandler
      ? [...(post.extraHandlers || []), post.overrideHandler] :
      [
        ...(post.extraHandlers || []),
        async (ctx: any) => { ctx.body = await handler.create(ctx.request.body) },
      ]
    )

    !!put?.enabled && router.put('/:id', put?.overrideHandler
      ? [...(put.extraHandlers || []), put.overrideHandler] :
      [
        ...(put.extraHandlers || []),
        async (ctx: any) => { ctx.body = await handler.update(ctx.params.id, ctx.request.body) },
      ]
    )

    !!deleteMethod?.enabled && router.delete('/:id', deleteMethod?.overrideHandler
      ? [...(deleteMethod.extraHandlers || []), deleteMethod.overrideHandler] :
      [
        ...(deleteMethod.extraHandlers || []),
        async (ctx: any) => { ctx.body = await handler.delete(ctx.params.id) },
      ]
    )

    return router
  })

  return router.middleware()
}
