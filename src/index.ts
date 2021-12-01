import 'reflect-metadata'
import { createConnection } from 'typeorm'
import { User } from './entity/User'
import * as Koa from 'koa'
import { generateRouter } from './lib'
import { Joi } from 'koa-joi-router'

createConnection().then(async connection => {
    const app = new Koa()

    // TODO: changed first param to accept json with
    //  [] filters to getAll
    //  [] add relations
    //  [] add error handling, logger and default response
    //  [] add tests and circleci
    // TODO: SUPER PLUS: add swagger documentation or insomnia integration (or both)
    app.use(generateRouter([{
        entity: User,
        methods: {
            post: {
                dto: {
                    body: Joi.object({
                        firstName: Joi.string().required(),
                        lastName: Joi.string().required(),
                        age: Joi.number().integer().required()
                    }),
                    type: 'json'
                }
            },
            put: {
                dto: {
                    body: Joi.object({
                        firstName: Joi.string().required(),
                        lastName: Joi.string().required(),
                        age: Joi.number().integer().required()
                    }),
                    type: 'json'
                }
            }
        }
    }]))
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
    }
    //endregion

}).catch(error => console.log(error))
