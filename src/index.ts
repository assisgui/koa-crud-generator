import 'reflect-metadata'
import { createConnection } from 'typeorm'
import { User } from './entity/User'
import * as Koa from 'koa'
import { generateRouter } from './lib'
import { Joi } from 'koa-joi-router'
import UserDto from "./entity/User.dto";
import {Post} from "./entity/Post";

createConnection().then(async connection => {
  const app = new Koa()

  // TODO: changed first param to accept json with
  //  [] filters to getAll -- PENSAR NESSE QUE TA OSSO
  //  [] add tests and circleci
  // TODO: SUPER PLUS: add swagger documentation or insomnia integration (or both)

  app.use(
    generateRouter([
      {
        entity: User,
        endpoints: {
          getAll: {},
          getOne: {
            relations: ['posts']
          },
          search: {
            relations: ['posts'],
            filters: [{
              field: 'name',
              type: 'string'
            }]
          },
          post: { dto: UserDto.post },
          put: { dto: UserDto.put }
        }
      },
      {
        entity: Post,
        endpoints: {
          getAll: {
            relations: ['user']
          },
          getOne: {
            relations: ['user']
          },
          search: {
            relations: ['user'],
          },
        }
      }
    ])
  )
  app.listen(3000)

  //region seed
  let seedAmount = new Array(10).fill(0).map((_, i) => i)
  for await (const i of seedAmount) {
    console.log("Inserting a new user into the database...")
    const user = await connection.manager.save(User, {
      firstName: `firstName ${i}`,
      lastName: `lastName ${i}`,
      age: i
    })
    console.log("Saved a new user with id: " + user.id)

    console.log("Inserting a new post into the database...")
    for await (const j of seedAmount) {
      const post = await connection.manager.save(Post, {
        title: `title ${j}`,
        text: `text ${j}`,
        content: `content ${j}`,
        user: user
      })
      console.log("Saved a new post with id: " + post.id)
    }
  }
  //endregion

}).catch(error => console.log(error))
