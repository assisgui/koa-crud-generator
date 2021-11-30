import * as koaRouter from 'koa-joi-router'
import {HandlersFactory} from "./handlers";

export const generateRouter = (entities: any[]) => {
  const router = koaRouter()
  entities.map(entity => {
    router.prefix(`/${entity.name}`)

    const handler = new HandlersFactory(entity)

    router.get('/', async (ctx: any) => {
      ctx.body = await handler.getAll({}, ctx.query.page, ctx.query.pageSize, true)
    })

    router.get('/:id', async (ctx: any) => {
      ctx.body = await handler.getOne(ctx.params.id)
    })

    router.post('/', async (ctx: any) => {
      ctx.body = await handler.create(ctx.request.body)
    })

    router.put('/:id', async (ctx: any) => {
      ctx.body = await handler.update(ctx.params.id, ctx.request.body)
    })

    router.delete('/:id', async (ctx: any) => {
      ctx.body = await handler.delete(ctx.params.id)
    })

    return router
  })

  return router.middleware()
}
